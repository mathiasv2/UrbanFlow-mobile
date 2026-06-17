import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Card from "./Card";
import LineBadge from "./LineBadge";
import { getSeverityMeta } from "../theme/transport";
import { timeAgo } from "../utils/time";
import { IncidentType } from "../utils/types/domainModels";
import { Incident } from "../utils/types/incident";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const TYPE_ICON: Record<IncidentType, IconName> = {
  delay: "clock-alert-outline",
  works: "hammer-wrench",
  cancellation: "close-octagon-outline",
  diversion: "directions-fork",
};

const TYPE_LABEL: Record<IncidentType, string> = {
  delay: "Retard",
  works: "Travaux",
  cancellation: "Suppression",
  diversion: "Déviation",
};

export default function IncidentItem({
  incident,
  onPress,
}: {
  incident: Incident;
  onPress?: () => void;
}) {
  const sev = getSeverityMeta(incident.severity);
  const icon: IconName = TYPE_ICON[incident.type] || "alert-circle-outline";

  return (
    <Card onPress={onPress} className="mb-3">
      <View className="flex-row items-start">
        <View className={`mr-3 rounded-xl p-2 ${sev.bg}`}>
          <MaterialCommunityIcons name={icon} size={20} color={sev.color} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            {incident.lineName ? (
              <LineBadge name={incident.lineName} color={incident.lineColor} size="sm" />
            ) : (
              <View />
            )}
            <Text className={`font-sans-semibold text-xs ${sev.text}`}>
              {TYPE_LABEL[incident.type] || "Incident"}
            </Text>
          </View>

          <Text className="mt-1.5 font-sans-semibold text-sm text-ink dark:text-ink-dark">
            {incident.title}
          </Text>
          <Text
            numberOfLines={2}
            className="mt-0.5 font-sans text-xs text-ink-muted dark:text-ink-dark-muted"
          >
            {incident.description}
          </Text>
          {incident.updatedAt ? (
            <Text className="mt-1 font-sans text-[11px] text-ink-placeholder">
              Mis à jour {timeAgo(incident.updatedAt)}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}
