import { httpClient } from "@/core/service/http-client";
import type {
  Account,
  LoginResponse,
  RegisterReponse,
} from "@/model/interface/auth.interface";

class AuthService {
  private readonly baseUrl = "/auth";

  private getEndpoint(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  async login(params: Account): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>(this.getEndpoint("/login"), params);
  }

  async register(params: Account): Promise<RegisterReponse> {
    return httpClient.post<RegisterReponse>(
      this.getEndpoint("/register"),
      params,
    );
  }

  async logout(refreshToken?: string): Promise<void> {
    return httpClient.post<void>(
      this.getEndpoint("/logout"),
      refreshToken ? { refresh_token: refreshToken } : undefined,
    );
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>(this.getEndpoint("/refresh-token"), {
      refresh_token: refreshToken,
    });
  }
}

export const authApi = new AuthService();
