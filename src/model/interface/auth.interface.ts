import { UserResponseType } from "@/model/interface/user.interface";

export interface LoginResponse {
  user: UserResponseType;
  access_token: string;
  refresh_token: string;
}

// define the Account interface
export interface Account {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
}

// define the RegisterReponse interface
export interface RegisterReponse {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}
