import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios, { HttpStatusCode } from "axios";

import { isEqual } from "@/core/configs";
import { authApi } from "@/core/service/auth.service";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
} from "@/core/utils/storage";
import type { LoginResponse } from "@/model/interface/auth.interface";

/**
 * Constants
 */
const ECONNABORTED = "ECONNABORTED";
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1000;
const TIMEOUT_MS = 10000;
const TOKEN_PREFIX = "Bearer";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Error types
 */
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

/**
 * Authentication related types
 */
type RefreshTokenQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

/**
 * Extended request config with retry tracking
 */
type ExtendedInternalAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
};

/**
 * Runtime constants
 */
const isClient = typeof window !== "undefined";

/**
 * HTTP Client Class
 */
class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: RefreshTokenQueueItem[] = [];
  private authService: typeof authApi;

  constructor(baseURL: string = API_URL ?? "") {
    this.instance = axios.create({
      baseURL,
      timeout: TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.authService = authApi;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) =>
        this.handleRequest(config) as InternalAxiosRequestConfig,
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => this.handleResponse(response),
      async (error: AxiosError) => {
        try {
          // Handle retry for network errors
          if (this.shouldRetry(error)) {
            return await this.retryRequest(error);
          }

          // Handle auth errors
          if (this.isUnauthorizedError(error)) {
            return await this.handleUnauthorizedError(error);
          }

          // Handle validation errors
          if (this.isValidationError(error)) {
            throw new UnprocessableEntityError(
              error.response?.data as UnprocessableEntityErrorPayload,
            );
          }

          // Generic error handling
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

  private handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    // Ensure baseURL is set
    if (!config.baseURL) {
      config.baseURL = API_URL;
    }

    // Add auth token if available on client
    if (isClient) {
      const accessToken = getAccessTokenFromLS();
      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `${TOKEN_PREFIX} ${accessToken}`,
        };
      }
    }

    return config;
  }

  private handleResponse<T = unknown>(
    response: AxiosResponse<T>,
  ): AxiosResponse<T> {
    if (!isClient) return response;

    const url = response.config.url || "";

    // Handle login response
    if (url.includes("/api/auth/login")) {
      const { access_token } = response.data as LoginResponse;
      setAccessTokenToLS(access_token);
    }
    // Handle logout response
    else if (url.includes("/api/auth/logout")) {
      clearLS();
    }

    return response;
  }

  private shouldRetry(error: AxiosError): boolean {
    const config = error.config as
      | ExtendedInternalAxiosRequestConfig
      | undefined;
    return (
      !!config &&
      isEqual(error.code, ECONNABORTED) &&
      (!config._retryCount || config._retryCount < MAX_RETRY_COUNT)
    );
  }

  private async retryRequest<T = unknown>(
    error: AxiosError,
  ): Promise<AxiosResponse<T>> {
    const config = error.config as ExtendedInternalAxiosRequestConfig;
    if (!config) {
      return Promise.reject(error);
    }

    config._retryCount = (config._retryCount || 0) + 1;

    // Exponential backoff
    const delayMs = RETRY_DELAY_MS * config._retryCount;
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    return this.instance<T>(config);
  }

  private isUnauthorizedError(error: AxiosError): boolean {
    return isEqual(error.response?.status, HttpStatusCode.Unauthorized);
  }

  private isValidationError(error: AxiosError): boolean {
    return isEqual(error.response?.status, HttpStatusCode.UnprocessableEntity);
  }

  private async handleUnauthorizedError<T = unknown>(
    error: AxiosError,
  ): Promise<AxiosResponse<T>> {
    const originalRequest = error.config as
      | ExtendedInternalAxiosRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip if already retrying
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${token}`;
          }
          return this.instance<T>(originalRequest);
        })
        .catch(() => {
          return Promise.reject(error);
        });
    }

    // Start refresh token process
    this.isRefreshing = true;
    try {
      const response = await this.authService.refreshToken(
        getRefreshTokenFromLS() as string,
      );
      const newToken = response.access_token as string;

      // Update token in storage
      setAccessTokenToLS(newToken);

      // Update request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${newToken}`;
      }

      // Process queued requests
      this.processQueue(newToken);

      // Retry the original request
      return this.instance<T>(originalRequest);
    } catch (refreshError) {
      // Handle refresh token failure
      this.processQueue(null, refreshError);

      // Logout user
      await this.handleLogout();

      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(token: string | null, error?: unknown): void {
    if (token) {
      // Resolve all queued requests with the new token
      this.refreshQueue.forEach(({ resolve }) => resolve(token));
    } else {
      // Reject all queued requests
      this.refreshQueue.forEach(({ reject }) =>
        reject(error || new Error("Failed to refresh token")),
      );
    }

    // Clear the queue
    this.refreshQueue = [];
  }

  private async handleLogout(): Promise<void> {
    try {
      await this.authService.logout();
      clearLS();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearLS();
    }
  }

  private normalizeErrorPayload(data: unknown): HttpErrorPayload {
    if (!data) return { message: "Unknown error" };

    const payload = data as Record<string, unknown>;

    // Standardize message field
    if (payload.msg && !payload.message) {
      payload.message = payload.msg;
    }

    return payload as HttpErrorPayload;
  }

  /**
   * Public methods for making API requests
   */
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

  // Access the Axios instance directly if needed
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

/**
 * Create a default HttpClient instance
 */
export const httpClient = new HttpClient();
