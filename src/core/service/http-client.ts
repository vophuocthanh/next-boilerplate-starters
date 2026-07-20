import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axios, { HttpStatusCode } from "axios";

import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/core/utils/storage";
import type { RefreshTokenResponse } from "@/core/types/auth";

const MAX_RETRY_COUNT = 3;
const RETRY_BASE_DELAY_MS = 500;
const TIMEOUT_MS = 10000;

/**
 * Same-origin BFF proxy (or direct API base if you change this).
 * Auth tokens live in localStorage; this client attaches `Authorization: Bearer`.
 */
const PROXY_BASE_URL = "/api/proxy";
const AUTH_REFRESH_PATH = "/auth/refresh";

/** Paths that must not send the access token / must not trigger token refresh. */
const AUTH_PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

/** Transient failures worth retrying: no response at all, or an overloaded upstream. */
const RETRYABLE_CODES = ["ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK"];
const RETRYABLE_STATUSES: number[] = [
  HttpStatusCode.BadGateway,
  HttpStatusCode.ServiceUnavailable,
  HttpStatusCode.GatewayTimeout,
];

export class HttpError extends Error {
  constructor(
    public status: number,
    public payload: HttpErrorPayload,
  ) {
    super(payload?.message || "Http Error");
    this.name = "HttpError";
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(public payload: UnprocessableEntityErrorPayload) {
    super(HttpStatusCode.UnprocessableEntity, payload);
    this.name = "UnprocessableEntityError";
  }
}

type HttpErrorPayload = {
  message?: string;
  msg?: string;
  [key: string]: unknown;
};

type UnprocessableEntityErrorPayload = HttpErrorPayload & {
  errors: Record<string, string>;
};

type RefreshTokenQueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

type ExtendedInternalAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
};

const isClient = typeof window !== "undefined";

function isAuthPublicPath(url?: string): boolean {
  if (!url) return false;
  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path));
}

class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: RefreshTokenQueueItem[] = [];

  constructor(baseURL: string = PROXY_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use((config) => {
      if (isClient && !isAuthPublicPath(config.url)) {
        const accessToken = getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        try {
          if (this.shouldRetry(error)) {
            return await this.retryRequest(error);
          }

          if (error.response?.status === HttpStatusCode.Unauthorized) {
            return await this.handleUnauthorizedError(error);
          }

          if (error.response?.status === HttpStatusCode.UnprocessableEntity) {
            throw new UnprocessableEntityError(
              error.response.data as UnprocessableEntityErrorPayload,
            );
          }

          throw new HttpError(
            error.response?.status || HttpStatusCode.InternalServerError,
            this.normalizeErrorPayload(error.response?.data),
          );
        } catch (processedError) {
          return Promise.reject(processedError);
        }
      },
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    const config = error.config as
      | ExtendedInternalAxiosRequestConfig
      | undefined;
    if (!config || (config._retryCount ?? 0) >= MAX_RETRY_COUNT) {
      return false;
    }

    // Never retry auth bootstrap endpoints.
    if (isAuthPublicPath(config.url)) {
      return false;
    }

    const status = error.response?.status;
    return (
      (!!error.code && RETRYABLE_CODES.includes(error.code)) ||
      (!!status && RETRYABLE_STATUSES.includes(status))
    );
  }

  private async retryRequest<T = unknown>(error: AxiosError) {
    const config = error.config as ExtendedInternalAxiosRequestConfig;
    config._retryCount = (config._retryCount || 0) + 1;

    // Exponential backoff with jitter, so a fleet of clients doesn't
    // synchronise its retries against a recovering server.
    const backoff = RETRY_BASE_DELAY_MS * 2 ** (config._retryCount - 1);
    const jitter = backoff * 0.2 * Math.random();
    await new Promise((resolve) => setTimeout(resolve, backoff + jitter));

    return this.instance<T>(config);
  }

  private async handleUnauthorizedError<T = unknown>(error: AxiosError) {
    const originalRequest = error.config as
      | ExtendedInternalAxiosRequestConfig
      | undefined;

    if (
      !originalRequest ||
      originalRequest._retry ||
      !isClient ||
      isAuthPublicPath(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (this.isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      }).then(() => this.instance<T>(originalRequest));
    }

    this.isRefreshing = true;
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const { data } = await this.instance.post<RefreshTokenResponse>(
        AUTH_REFRESH_PATH,
        { refreshToken },
      );

      setAccessToken(data.accessToken);
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }

      this.processQueue();
      return this.instance<T>(originalRequest);
    } catch (refreshError) {
      this.processQueue(refreshError);
      this.clearSession();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error?: unknown): void {
    const queue = this.refreshQueue;
    this.refreshQueue = [];

    if (error) {
      queue.forEach(({ reject }) => reject(error));
    } else {
      queue.forEach(({ resolve }) => resolve());
    }
  }

  private clearSession(): void {
    clearAuthSession();
  }

  private normalizeErrorPayload(data: unknown): HttpErrorPayload {
    if (!data) return { message: "Unknown error" };

    const payload = data as Record<string, unknown>;

    if (payload.msg && !payload.message) {
      payload.message = payload.msg;
    }

    return payload as HttpErrorPayload;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

export const httpClient = new HttpClient();
