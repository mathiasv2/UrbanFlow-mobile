import { TransportType } from "../domainModels";

export interface StopSummary {
  id: number;
  name: string;
  lat: number;
  lng: number;
  lines: number[];
  types: TransportType[];
  distanceMeters?: number;
}