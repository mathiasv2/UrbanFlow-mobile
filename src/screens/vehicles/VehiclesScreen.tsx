import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Screen from "../../components/Screen";
import VehicleItem from "../../components/VehicleItem";
import { Loading, EmptyState } from "../../components/StateView";
import { TRANSPORT_TYPES } from "../../theme/transport";
import { formatClock } from "../../utils/time";
import { linesApi } from "../../api/lines";
import { vehiclesApi } from "../../api/vehicles";
import { VehiclesStackParamList } from "../../utils/types/StackParamList/vahiclesStackParamList";
import { TransportType } from "../../utils/types/domainModels";
import { LineSummary } from "../../utils/types/Line/lineSummary";
import { Vehicle } from "../../utils/types/Vehicles/vehicle";

type Props = NativeStackScreenProps<VehiclesStackParamList, "Vehicles">;
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const TYPE_OPTIONS: TransportType[] = ["metro", "bus", "tram", "rer"];


export default function VehiclesScreen({ navigation }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [lines, setLines] = useState<LineSummary[]>([]);
  const [typeFilter, setTypeFilter] = useState<TransportType | null>(null);
  const [lineFilter, setLineFilter] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    linesApi
      .list()
      .then((d) => setLines(d.lines || []))
      .catch(() => {});
  }, []);

  const fetchVehicles = useCallback(
    async (isManual = false) => {
      setError(null);
      if (isManual) setRefreshing(true);
      else setLoading(true);
      try {
        const data = await vehiclesApi.list({
          type: typeFilter ?? undefined,
          lineId: lineFilter ?? undefined,
        });
        setVehicles(data.vehicles || []);
        setUpdatedAt(data.updatedAt);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [typeFilter, lineFilter]
  );

  useEffect(() => {
    fetchVehicles(false);
  }, [fetchVehicles]);

  const visibleLines = typeFilter ? lines.filter((l) => l.type === typeFilter) : lines;

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-4 pt-3">
        <Text className="font-sans text-xs text-ink-placeholder">
          {updatedAt ? `Mis à jour à ${formatClock(updatedAt)}` : "Données temps réel"}
        </Text>
        <Pressable
          onPress={() => fetchVehicles(true)}
          className="flex-row items-center rounded-full bg-primary-light px-3 py-1.5 active:opacity-70 dark:bg-card-dark"
        >
          <MaterialCommunityIcons
            name="refresh"
            size={16}
            color="#6912E2"
            style={refreshing ? { opacity: 0.5 } : undefined}
          />
          <Text className="ml-1 font-sans-semibold text-sm text-primary">
            {refreshing ? "Actualisation…" : "Actualiser"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <Chip
          label="Tous"
          active={!typeFilter}
          onPress={() => {
            setTypeFilter(null);
            setLineFilter(null);
          }}
        />
        {TYPE_OPTIONS.map((t) => (
          <Chip
            key={t}
            label={TRANSPORT_TYPES[t].label}
            icon={TRANSPORT_TYPES[t].icon as IconName}
            active={typeFilter === t}
            onPress={() => {
              setTypeFilter(typeFilter === t ? null : t);
              setLineFilter(null);
            }}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
      >
        {visibleLines.map((l) => (
          <Chip
            key={l.id}
            label={l.name}
            color={l.color}
            active={lineFilter === l.id}
            onPress={() => setLineFilter(lineFilter === l.id ? null : l.id)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <Loading label="Chargement des véhicules…" />
      ) : error ? (
        <EmptyState icon="wifi-off" title="Erreur de chargement" subtitle={error} onRetry={() => fetchVehicles(true)} />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ListEmptyComponent={
            <EmptyState icon="bus-alert" title="Aucun véhicule" subtitle="Aucun véhicule pour ce filtre." />
          }
          renderItem={({ item }) => (
            <VehicleItem
              vehicle={item}
              onPress={() => navigation.navigate("VehicleDetail", { id: item.id })}
            />
          )}
        />
      )}
    </Screen>
  );
}

function Chip({
  label,
  icon,
  color,
  active,
  onPress,
}: {
  label: string;
  icon?: IconName;
  color?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={active && color ? { backgroundColor: color } : undefined}
      className={`mr-2 flex-row items-center rounded-full border px-3 py-1.5 ${
        active
          ? color
            ? "border-transparent"
            : "border-primary bg-primary"
          : "border-border bg-card dark:border-border-dark dark:bg-card-dark"
      }`}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={14}
          color={active ? "#fff" : "#6E6E73"}
          style={{ marginRight: 4 }}
        />
      ) : null}
      <Text
        className={`font-sans-medium text-sm ${
          active ? "text-white" : "text-ink-muted dark:text-ink-dark-muted"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
