import type { AuthSession } from "@/core/types/auth";

/** Alias used by auth feature / API responses. */
export type LoginResponse = AuthSession;

export type {
  AuthSession,
  AuthTokens,
  RefreshTokenResponse,
} from "@/core/types/auth";

export interface Account {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}
