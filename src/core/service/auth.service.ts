import { httpClient } from "@/core/service/http-client";
import { clearAuthSession, setAuthSession } from "@/core/utils/storage";
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
    setAuthSession(data);
    return data;
  }

  async register(params: Account): Promise<RegisterResponse> {
    return httpClient.post<RegisterResponse>(
      this.getEndpoint("/register"),
      params,
    );
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(this.getEndpoint("/logout"));
    } catch {
    } finally {
      clearAuthSession();
    }
  }
}

export const authApi = new AuthService();
