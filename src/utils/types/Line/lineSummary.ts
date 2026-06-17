import { TransportType } from "../domainModels";

export interface LineSummary {
  id: number;
  name: string;
  type: TransportType;
  color: string;
  from: string;
  to: string;
  stopCount: number;
}