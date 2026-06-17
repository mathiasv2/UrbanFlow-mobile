import { StopSummary, StopDetail, DeparturesResponse } from "../types";
import { apiClient } from "./client";

export const stopsApi = {
  list: (q?: string) => apiClient.get<{ stops: StopSummary[] }>("/stops", { params: { q } }),
  nearest: (input: { lat: number; lng: number; limit?: number }) =>
    apiClient.get<{ stops: StopSummary[] }>("/stops/nearest", {
      params: { lat: input.lat, lng: input.lng, limit: input.limit ?? 1 },
    }),
  detail: (id: number) => apiClient.get<StopDetail>(`/stops/${id}`),
  departures: (id: number, limit = 12) =>
    apiClient.get<DeparturesResponse>(`/stops/${id}/departures`, { params: { limit } }),
};