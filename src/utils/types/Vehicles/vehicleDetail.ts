import { Vehicle } from "./vehicle";

export interface VehicleDetail extends Vehicle {
  estimatedArrivalAtNextStop: string;
  updatedAt: string;
}