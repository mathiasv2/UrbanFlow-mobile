import { User, Favorite } from "../types";
import { apiClient } from "./client";

export const usersApi = {
  me: (token: string) => apiClient.get<User>("/users/me", { token }),
  updateMe: (payload: Partial<Pick<User, "name" | "email">> & { password?: string }, token: string) =>
    apiClient.put<User>("/users/me", payload, { token }),
  favorites: (token: string) =>
    apiClient.get<{ favorites: Favorite[] }>("/users/me/favorites", { token }),
  addFavorite: (payload: { type: "line" | "stop"; refId: number }, token: string) =>
    apiClient.post<Favorite>("/users/me/favorites", payload, { token }),
  removeFavorite: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/users/me/favorites/${id}`, { token }),
};