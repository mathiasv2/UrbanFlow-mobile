import { Departure } from "./departure";

export interface DeparturesResponse {
  stopId: number;
  stopName: string;
  updatedAt: string;
  departures: Departure[];
}