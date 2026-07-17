import { httpClient } from "@/core/service/http-client";
import { clearUserCookie } from "@/core/utils/storage";
import type {
  Account,
  AuthSessionResponse,
  RegisterResponse,
} from "@/model/interface/auth.interface";

class AuthService {
  private readonly baseUrl = "/auth";

  private getEndpoint(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  /**
   * Login goes through a same-origin route so the server can set httpOnly
   * access/refresh cookies. Tokens never touch client JS storage.
   */
  async login(params: Account): Promise<AuthSessionResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      credentials: "same-origin",
    });

    const data = (await response.json().catch(() => ({}))) as
      | AuthSessionResponse
      | { message?: string };

    if (!response.ok) {
      throw new Error((data as { message?: string }).message || "Login failed");
    }

    return data as AuthSessionResponse;
  }

  async register(params: Account): Promise<RegisterResponse> {
    return httpClient.post<RegisterResponse>(
      this.getEndpoint("/register"),
      params,
    );
  }

  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      // httpOnly tokens are cleared by the route; drop the client-readable user cookie too.
      clearUserCookie();
    }
  }
}

export const authApi = new AuthService();
