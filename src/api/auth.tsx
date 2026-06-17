import { User, AuthResponse } from "../types";
import { apiClient } from "./client";

export const authApi = {
  register: (input: { name: string; email: string; password: string }) =>
    apiClient.post<{ user: User }>("/auth/register", input),
  login: (input: { email: string; password: string }) =>
    apiClient.post<AuthResponse>("/auth/login", input),
  logout: (token: string) =>
    apiClient.post<{ message: string }>("/auth/logout", undefined, { token }),
};