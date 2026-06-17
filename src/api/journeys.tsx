import { TimeMode, JourneyResponse } from "../types";
import { apiClient } from "./client";

export const journeysApi = {
  search: (input: {
    fromStopId: number;
    toStopId: number;
    datetime?: string;
    type?: TimeMode;
  }) =>
    apiClient.get<JourneyResponse>("/journeys", {
      params: {
        fromStopId: input.fromStopId,
        toStopId: input.toStopId,
        datetime: input.datetime,
        type: input.type ?? "departure",
      },
    }),
};