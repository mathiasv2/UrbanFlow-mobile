import { NavigatorScreenParams } from "@react-navigation/native";
import { AccountStackParamList } from "./accountStackParamList";
import { JourneyStackParamList } from "./journeyStackParamList";
import { StopsStackParamList } from "./stopsStackParamList";
import { VehiclesStackParamList } from "./vahiclesStackParamList";

export type MainTabParamList = {
  JourneyTab: NavigatorScreenParams<JourneyStackParamList>;
  VehiclesTab: NavigatorScreenParams<VehiclesStackParamList>;
  StopsTab: NavigatorScreenParams<StopsStackParamList>;
  AccountTab: NavigatorScreenParams<AccountStackParamList>;
};
