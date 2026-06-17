import { TransportType, DepartureStatus } from "../domainModels";

export interface Departure {
  id: number;
  lineId: number;
  lineName: string;
  lineColor: string;
  type: TransportType;
  destination: string;
  scheduledAt: string;
  expectedAt: string;
  delayMinutes: number;
  status: DepartureStatus;
}