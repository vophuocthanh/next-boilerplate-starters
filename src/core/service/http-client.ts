import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axios, { HttpStatusCode } from "axios";

import { API_URL } from "@/core/configs/env";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
} from "@/core/utils/storage";
import type { LoginResponse } from "@/model/interface/auth.interface";

const MAX_RETRY_COUNT = 3;
const RETRY_BASE_DELAY_MS = 500;
const TIMEOUT_MS = 10000;
const TOKEN_PREFIX = "Bearer";

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
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

type ExtendedInternalAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
};

const isClient = typeof window !== "undefined";

/**
 * Bare client used only to renew tokens. It deliberately has no interceptors:
 * routing the refresh call through the main instance would let a 401 from the
 * refresh endpoint trigger another refresh, recursing without end.
 */
const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: RefreshTokenQueueItem[] = [];

  constructor(baseURL: string = API_URL) {
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
    this.instance.interceptors.request.use(
      (config) => this.handleRequest(config),
      (error) => Promise.reject(error),
    );

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

  private handleRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    if (isClient) {
      const accessToken = getAccessTokenFromLS();
      if (accessToken) {
        // `config.headers` is an AxiosHeaders instance; spreading it into a
        // plain object would strip the methods axios relies on downstream.
        config.headers.set("Authorization", `${TOKEN_PREFIX} ${accessToken}`);
      }
    }

    return config;
  }

  private shouldRetry(error: AxiosError): boolean {
    const config = error.config as
      | ExtendedInternalAxiosRequestConfig
      | undefined;
    if (!config || (config._retryCount ?? 0) >= MAX_RETRY_COUNT) {
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

    if (!originalRequest || originalRequest._retry || !isClient) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.set(
          "Authorization",
          `${TOKEN_PREFIX} ${token}`,
        );
        return this.instance<T>(originalRequest);
      });
    }

    this.isRefreshing = true;
    try {
      const refreshToken = getRefreshTokenFromLS();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const { data } = await refreshClient.post<LoginResponse>(
        "/auth/refresh-token",
        { refresh_token: refreshToken },
      );

      setAccessTokenToLS(data.access_token);
      if (data.refresh_token) {
        setRefreshTokenToLS(data.refresh_token);
      }

      originalRequest.headers.set(
        "Authorization",
        `${TOKEN_PREFIX} ${data.access_token}`,
      );
      this.processQueue(data.access_token);

      return this.instance<T>(originalRequest);
    } catch (refreshError) {
      this.processQueue(null, refreshError);
      clearLS();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(token: string | null, error?: unknown): void {
    const queue = this.refreshQueue;
    this.refreshQueue = [];

    if (token) {
      queue.forEach(({ resolve }) => resolve(token));
    } else {
      queue.forEach(({ reject }) =>
        reject(error || new Error("Failed to refresh token")),
      );
    }
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
