import { TransportType, Vehicle, VehicleDetail } from "../types";
import { apiClient } from "./client";

export const vehiclesApi = {
  list: (input: { lineId?: number; type?: TransportType } = {}) =>
    apiClient.get<{ updatedAt: string; vehicles: Vehicle[] }>("/vehicles", {
      params: { lineId: input.lineId, type: input.type },
    }),
  detail: (id: number) => apiClient.get<VehicleDetail>(`/vehicles/${id}`),
};