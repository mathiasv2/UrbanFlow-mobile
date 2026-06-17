import { Journey } from "./journey";

export interface JourneyResponse {
  from: { id: number; name: string };
  to: { id: number; name: string };
  requestedAt: string;
  journeys: Journey[];
}