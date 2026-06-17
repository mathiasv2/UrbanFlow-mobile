import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Screen from "../../components/Screen";
import Card from "../../components/Card";
import LineBadge from "../../components/LineBadge";
import TransportIcon from "../../components/TransportIcon";
import IncidentItem from "../../components/IncidentItem";
import { Loading, EmptyState } from "../../components/StateView";
import { linesApi } from "../../api/lines";
import { incidentsApi } from "../../api/incidents";
import { Incident } from "../../utils/types/incident";
import { LineDetail } from "../../utils/types/Line/lineDetail";
import { StopsStackParamList } from "../../utils/types/StackParamList/stopsStackParamList";

type Props = NativeStackScreenProps<StopsStackParamList, "LineDetail">;

export default function LineDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [line, setLine] = useState<LineDetail | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [detail, inc] = await Promise.all([
        linesApi.detail(id),
        incidentsApi.list({ lineId: id }),
      ]);
      setLine(detail);
      setIncidents(inc.incidents || []);
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
  if (error || !line)
    return (
      <Screen>
        <EmptyState icon="wifi-off" title="Erreur" subtitle={error ?? undefined} onRetry={load} />
      </Screen>
    );

  return (
    <Screen>
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Card className="mb-4">
          <View className="flex-row items-center">
            <TransportIcon type={line.type} size={24} circle />
            <View className="ml-3">
              <LineBadge name={line.name} color={line.color} />
              <Text className="mt-1 font-sans text-sm text-ink-muted dark:text-ink-dark-muted">
                {line.from} → {line.to}
              </Text>
            </View>
          </View>
          {line.operatingHours ? (
            <View className="mt-3 flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#AEAEB2" />
              <Text className="ml-2 font-sans text-xs text-ink-muted dark:text-ink-dark-muted">
                Service de {line.operatingHours.firstDeparture} à {line.operatingHours.lastDeparture}
              </Text>
            </View>
          ) : null}
        </Card>

        {incidents.length > 0 ? (
          <View className="mb-2">
            <Text className="mb-2 font-sans-semibold text-sm text-ink dark:text-ink-dark">
              Incidents en cours
            </Text>
            {incidents.map((i) => (
              <IncidentItem key={i.id} incident={i} />
            ))}
          </View>
        ) : null}

        <Text className="mb-2 font-sans-semibold text-sm text-ink dark:text-ink-dark">
          Itinéraire ({line.stops?.length || 0} arrêts)
        </Text>
        <Card>
          {(line.stops || []).map((s, i) => (
            <Pressable
              key={s.id}
              onPress={() => navigation.navigate("StopDetail", { id: s.id, name: s.name })}
              className="flex-row items-center py-1 active:opacity-60"
            >
              <View className="mr-3 items-center" style={{ width: 16 }}>
                <View style={{ backgroundColor: line.color }} className="h-3 w-3 rounded-full" />
                {i < line.stops.length - 1 ? (
                  <View style={{ backgroundColor: line.color }} className="my-0.5 w-0.5 flex-1 opacity-40" />
                ) : null}
              </View>
              <Text className="flex-1 py-2 font-sans text-base text-ink dark:text-ink-dark">
                {s.name}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color="#AEAEB2" />
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}
