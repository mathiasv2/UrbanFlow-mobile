import { User } from "../User/user";

export interface AuthResponse {
  token: string;
  user: User;
}