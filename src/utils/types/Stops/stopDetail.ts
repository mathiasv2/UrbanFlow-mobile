import { StopLineRef } from "./stopLineRef";

export interface StopDetail {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  lines: StopLineRef[];
  facilities?: string[];
}