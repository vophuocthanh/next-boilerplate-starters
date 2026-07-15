import { httpClient } from "@/core/service/http-client";
import {
  clearLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
  setUserToLS,
} from "@/core/utils/storage";
import type {
  Account,
  LoginResponse,
  RegisterResponse,
} from "@/model/interface/auth.interface";

class AuthService {
  private readonly baseUrl = "/auth";

  private getEndpoint(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  async login(params: Account): Promise<LoginResponse> {
    const data = await httpClient.post<LoginResponse>(
      this.getEndpoint("/login"),
      params,
    );

    setAccessTokenToLS(data.access_token);
    setRefreshTokenToLS(data.refresh_token);
    setUserToLS(data.user);

    return data;
  }

  async register(params: Account): Promise<RegisterResponse> {
    return httpClient.post<RegisterResponse>(
      this.getEndpoint("/register"),
      params,
    );
  }

  async logout(): Promise<void> {
    const refreshToken = getRefreshTokenFromLS();

    try {
      // The server needs the token to revoke it; without it the refresh token
      // stays valid long after the user believes they signed out.
      await httpClient.post<void>(this.getEndpoint("/logout"), {
        refresh_token: refreshToken,
      });
    } finally {
      clearLS();
    }
  }
}

export const authApi = new AuthService();
