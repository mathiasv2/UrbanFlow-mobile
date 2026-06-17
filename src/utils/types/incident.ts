import { IncidentType, Severity } from "./domainModels";
import { AffectedStop } from "./Stops/affectedStop";

export interface Incident {
  id: number;
  type: IncidentType;
  severity: Severity;
  lineId: number | null;
  lineName?: string;
  lineColor?: string;
  stopId: number | null;
  title: string;
  description: string;
  startedAt: string;
  estimatedEndAt: string;
  updatedAt?: string;
  affectedStops?: AffectedStop[];
}