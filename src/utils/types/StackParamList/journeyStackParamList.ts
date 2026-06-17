import { TimeMode } from "../domainModels";
import { StopSummary } from "../Stops/stopSummary";

export type JourneyStackParamList = {
  Planner: { picked?: StopSummary; field?: "from" | "to" } | undefined;
  StopPicker: { field: "from" | "to" };
  JourneyResults: {
    fromStop: StopSummary;
    toStop: StopSummary;
    mode: TimeMode;
    datetime: string;
  };
};