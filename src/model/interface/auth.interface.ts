import { UserResponseType } from "@/model/interface/user.interface";

export interface LoginResponse {
  user: UserResponseType;
  access_token: string;
  refresh_token: string;
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
