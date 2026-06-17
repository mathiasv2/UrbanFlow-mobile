import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "./Card";
import LineBadge from "./LineBadge";
import TransportIcon from "./TransportIcon";
import StatusBadge from "./StatusBadge";
import { getOccupancyMeta } from "../theme/transport";
import { Vehicle } from "../utils/types/Vehicles/vehicle";


export default function VehicleItem({
  vehicle,
  onPress,
}: {
  vehicle: Vehicle;
  onPress?: () => void;
}) {
  const occ = getOccupancyMeta(vehicle.occupancy);

  return (
    <Card onPress={onPress} className="mb-3">
      <View className="flex-row items-center">
        <TransportIcon type={vehicle.type} size={22} circle />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <LineBadge name={vehicle.lineName} color={vehicle.lineColor} size="sm" />
            <Text
              numberOfLines={1}
              className="ml-2 flex-1 font-sans-semibold text-sm text-ink dark:text-ink-dark"
            >
              → {vehicle.destination}
            </Text>
          </View>
          {vehicle.nextStopName ? (
            <View className="mt-1 flex-row items-center">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={13}
                color="#AEAEB2"
              />
              <Text className="ml-1 font-sans text-xs text-ink-muted dark:text-ink-dark-muted">
                Prochain arrêt : {vehicle.nextStopName}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <StatusBadge status={vehicle.status} delayMinutes={vehicle.delayMinutes} />
        {occ ? (
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name={occ.icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
              size={15}
              color={occ.color}
            />
            <Text className="ml-1 font-sans text-xs text-ink-muted dark:text-ink-dark-muted">
              {occ.label}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}
