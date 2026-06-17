import { TransportType, LineSummary, LineDetail } from "../types";
import { apiClient } from "./client";

export const linesApi = {
  list: (type?: TransportType) =>
    apiClient.get<{ lines: LineSummary[] }>("/lines", { params: { type } }),
  detail: (id: number) => apiClient.get<LineDetail>(`/lines/${id}`),
};