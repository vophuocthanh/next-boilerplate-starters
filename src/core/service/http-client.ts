import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axios, { HttpStatusCode } from "axios";

const MAX_RETRY_COUNT = 3;
const RETRY_BASE_DELAY_MS = 500;
const TIMEOUT_MS = 10000;

/**
 * Same-origin BFF endpoints.
 * Access/refresh tokens live in httpOnly cookies (set by /api/auth/*).
 * The browser never reads tokens; /api/proxy attaches Authorization server-side.
 */
const PROXY_BASE_URL = "/api/proxy";
const AUTH_REFRESH_URL = "/api/auth/refresh";
const AUTH_LOGOUT_URL = "/api/auth/logout";

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

class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: RefreshTokenQueueItem[] = [];

  constructor(baseURL: string = PROXY_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: TIMEOUT_MS,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
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
      return new Promise<void>((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      }).then(() => this.instance<T>(originalRequest));
    }

    this.isRefreshing = true;
    try {
      // Refresh route reads the httpOnly refresh cookie and rotates tokens.
      const refreshResponse = await fetch(AUTH_REFRESH_URL, {
        method: "POST",
        credentials: "same-origin",
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh session");
      }

      this.processQueue();
      return this.instance<T>(originalRequest);
    } catch (refreshError) {
      this.processQueue(refreshError);
      await this.clearSession();
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

  private async clearSession(): Promise<void> {
    try {
      await fetch(AUTH_LOGOUT_URL, {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // Best-effort; browser may already have cleared cookies on expiry.
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
