import { UserResponseType } from "@/model/interface/user.interface";

/** Raw login payload returned by the upstream API (tokens never leave the server). */
export interface LoginResponse {
  user: UserResponseType;
  access_token: string;
  refresh_token: string;
}

/** Client-facing session after login — tokens live in httpOnly cookies only. */
export interface AuthSessionResponse {
  user: UserResponseType;
}

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
