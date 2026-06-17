import React from "react";
import { View, Text } from "react-native";
import { getStatusMeta } from "../theme/transport";
import { DepartureStatus, VehicleStatus } from "../utils/types/domainModels";

export default function StatusBadge({
  status,
  delayMinutes,
}: {
  status: DepartureStatus | VehicleStatus | string;
  delayMinutes?: number;
}) {
  const meta = getStatusMeta(status);
  const label =
    meta.key === "delayed" && delayMinutes
      ? `Retardé +${delayMinutes} min`
      : meta.label;

  return (
    <View
      className={`flex-row items-center self-start rounded-full px-2.5 py-1 ${meta.bg}`}
    >
      <View className={`mr-1.5 h-2 w-2 rounded-full ${meta.dot}`} />
      <Text className={`font-sans-semibold text-xs ${meta.text}`}>{label}</Text>
    </View>
  );
}
