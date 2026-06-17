import { JourneyLeg } from "./journeyLeg";

export interface Journey {
  id: number;
  totalDurationMinutes: number;
  departureAt: string;
  arrivalAt: string;
  transfers: number;
  legs: JourneyLeg[];
}