import { Incident, Departure, Journey } from "../types";
import { apiClient } from "./client";

export const incidentsApi = {
  list: (input: { lineId?: number; stopId?: number } = {}) =>
    apiClient.get<{ incidents: Incident[] }>("/incidents", {
      params: { lineId: input.lineId, stopId: input.stopId },
    }),
  detail: (id: number) => apiClient.get<Incident>(`/incidents/${id}`),
};

export type { Departure, Journey };