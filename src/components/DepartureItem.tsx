import React from "react";
import { View, Text } from "react-native";

import LineBadge from "./LineBadge";
import TransportIcon from "./TransportIcon";
import Countdown from "./Countdown";
import { formatClock } from "../utils/time";
import { getStatusMeta } from "../theme/transport";
import { Departure } from "../utils/types/Departure/departure";


export default function DepartureItem({ departure }: { departure: Departure }) {
  const meta = getStatusMeta(departure.status);

  return (
    <View className="flex-row items-center py-3">
      <TransportIcon type={departure.type} size={18} circle />

      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <LineBadge name={departure.lineName} color={departure.lineColor} size="sm" />
          <Text
            numberOfLines={1}
            className="ml-2 flex-1 font-sans-medium text-sm text-ink dark:text-ink-dark"
          >
            {departure.destination}
          </Text>
        </View>
        <Text className="mt-1 font-sans text-xs text-ink-muted dark:text-ink-dark-muted">
          Prévu à {formatClock(departure.scheduledAt)}
          {departure.delayMinutes > 0 ? ` · +${departure.delayMinutes} min` : ""}
        </Text>
      </View>

      <View className="items-end">
        <Countdown
          iso={departure.expectedAt}
          className={`font-sans-bold text-base ${meta.text}`}
        />
        <Text className={`font-sans-medium text-[11px] ${meta.text}`}>
          {meta.emoji} {meta.label}
        </Text>
      </View>
    </View>
  );
}
