import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../components/Screen";
import Card from "../../components/Card";
import LineBadge from "../../components/LineBadge";
import TransportIcon from "../../components/TransportIcon";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { Loading, EmptyState } from "../../components/StateView";
import { getOccupancyMeta } from "../../theme/transport";
import { formatClock } from "../../utils/time";
import { vehiclesApi } from "../../api/vehicles";
import { VehicleDetail } from "../../utils/types/Vehicles/vehicleDetail";
import { VehiclesStackParamList } from "../../utils/types/StackParamList/vahiclesStackParamList";

type Props = NativeStackScreenProps<VehiclesStackParamList, "VehicleDetail">;
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export default function VehicleDetailScreen({ route }: Props) {
  const { id } = route.params;
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      setVehicle(await vehiclesApi.detail(id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Screen><Loading /></Screen>;
  if (error || !vehicle)
    return (
      <Screen>
        <EmptyState icon="wifi-off" title="Erreur" subtitle={error ?? undefined} onRetry={load} />
      </Screen>
    );

  const occ = getOccupancyMeta(vehicle.occupancy);

  return (
    <Screen>
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Card className="mb-4 items-center">
          <TransportIcon type={vehicle.type} size={34} circle />
          <View className="mt-3 mb-2">
            <LineBadge name={vehicle.lineName} color={vehicle.lineColor} />
          </View>
          <Text className="font-sans-bold text-lg text-ink dark:text-ink-dark">
            → {vehicle.destination}
          </Text>
          <View className="mt-3">
            <StatusBadge status={vehicle.status} delayMinutes={vehicle.delayMinutes} />
          </View>
        </Card>

        <Card className="mb-4">
          <InfoRow icon="map-marker-outline" label="Prochain arrêt" value={vehicle.nextStopName} />
          <Divider />
          <InfoRow
            icon="clock-outline"
            label="Arrivée estimée au prochain arrêt"
            value={formatClock(vehicle.estimatedArrivalAtNextStop)}
          />
          {occ ? (
            <>
              <Divider />
              <InfoRow icon={occ.icon as IconName} label="Affluence" value={occ.label} />
            </>
          ) : null}
          <Divider />
          <InfoRow
            icon="compass-outline"
            label="Position"
            value={`${vehicle.lat?.toFixed(4)}, ${vehicle.lng?.toFixed(4)}`}
          />
        </Card>

        <Button title="Actualiser" variant="secondary" icon="refresh" onPress={load} />
      </ScrollView>
    </Screen>
  );
}

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value?: string }) {
  return (
    <View className="flex-row items-center py-2.5">
      <MaterialCommunityIcons name={icon} size={20} color="#6912E2" />
      <Text className="ml-3 flex-1 font-sans text-sm text-ink-muted dark:text-ink-dark-muted">
        {label}
      </Text>
      <Text className="font-sans-semibold text-sm text-ink dark:text-ink-dark">
        {value ?? "—"}
      </Text>
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-border dark:bg-border-dark" />;
}
