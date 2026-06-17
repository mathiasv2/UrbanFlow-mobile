import { TransportType, VehicleStatus, Occupancy } from "../domainModels";

export interface Vehicle {
  id: number;
  lineId: number;
  lineName: string;
  lineColor: string;
  type: TransportType;
  lat: number;
  lng: number;
  heading: number;
  status: VehicleStatus;
  destination: string;
  nextStopId: number;
  nextStopName: string;
  occupancy: Occupancy;
  delayMinutes?: number;
}