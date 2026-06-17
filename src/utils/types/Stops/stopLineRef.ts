import { TransportType } from "../domainModels";

export interface StopLineRef {
  id: number;
  name: string;
  type: TransportType;
  color: string;
}