import { TransportType } from "../domainModels";
import { JourneyIntermediate } from "./journeyIntermediate";
import { JourneyStopRef } from "./journeyStopRef";

export interface JourneyLeg {
  order: number;
  lineId: number;
  lineName: string;
  lineColor: string;
  type: TransportType;
  from: JourneyStopRef;
  to: JourneyStopRef;
  departureAt: string;
  arrivalAt: string;
  intermediateStops: JourneyIntermediate[];
}