import { TransportType } from "../domainModels";
import { LineStop } from "../Stops/lineStop";
import { OperatingHours } from "./operatingHours";

export interface LineDetail {
  id: number;
  name: string;
  type: TransportType;
  color: string;
  from: string;
  to: string;
  stops: LineStop[];
  activeIncidents: number;
  operatingHours?: OperatingHours;
  
}