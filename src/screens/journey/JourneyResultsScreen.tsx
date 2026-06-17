import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Screen from "../../components/Screen";
import Card from "../../components/Card";
import LineBadge from "../../components/LineBadge";
import TransportIcon from "../../components/TransportIcon";
import { Loading, EmptyState } from "../../components/StateView";
import { formatClock, formatDuration } from "../../utils/time";
import { journeysApi } from "../../api/journeys";
import { Journey } from "../../api/incidents";
import { JourneyLeg } from "../../utils/types/Journey/journeyLeg";
import { JourneyResponse } from "../../utils/types/Journey/journeyResponse";
import { JourneyStackParamList } from "../../utils/types/StackParamList/journeyStackParamList";

type Props = NativeStackScreenProps<JourneyStackParamList, "JourneyResults">;


export default function JourneyResultsScreen({ route }: Props) {
  const { fromStop, toStop, mode, datetime } = route.params;
  const [data, setData] = useState<JourneyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await journeysApi.search({
        fromStopId: fromStop.id,
        toStopId: toStop.id,
        datetime,
        type: mode,
      });
      setData(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fromStop, toStop, datetime, mode]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Screen><Loading label="Calcul des itinéraires…" /></Screen>;
  if (error || !data)
    return (
      <Screen>
        <EmptyState icon="wifi-off" title="Calcul impossible" subtitle={error ?? undefined} onRetry={load} />
      </Screen>
    );

  return (
    <Screen>
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-4 flex-row items-center">
          <Text numberOfLines={1} className="flex-1 font-sans-semibold text-base text-ink dark:text-ink-dark">
            {data.from.name}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#AEAEB2" />
          <Text numberOfLines={1} className="flex-1 text-right font-sans-semibold text-base text-ink dark:text-ink-dark">
            {data.to.name}
          </Text>
        </View>

        {data.journeys.map((journey, idx) => (
          <JourneyCard key={journey.id} journey={journey} index={idx} />
        ))}
      </ScrollView>
    </Screen>
  );
}

function JourneyCard({ journey, index }: { journey: Journey; index: number }) {
  return (
    <Card className="mb-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="font-sans-bold text-lg text-ink dark:text-ink-dark">
            {formatClock(journey.departureAt)}
          </Text>
          <MaterialCommunityIcons name="arrow-right-thin" size={20} color="#AEAEB2" />
          <Text className="font-sans-bold text-lg text-ink dark:text-ink-dark">
            {formatClock(journey.arrivalAt)}
          </Text>
        </View>
        <View className="flex-row items-center rounded-full bg-primary-light px-3 py-1 dark:bg-card-dark">
          <MaterialCommunityIcons name="timer-outline" size={14} color="#6912E2" />
          <Text className="ml-1 font-sans-semibold text-sm text-primary">
            {formatDuration(journey.totalDurationMinutes)}
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="font-sans text-xs text-ink-placeholder">
          {index === 0 ? "Le plus rapide" : "Alternative"} ·{" "}
          {journey.transfers === 0
            ? "Direct"
            : `${journey.transfers} correspondance${journey.transfers > 1 ? "s" : ""}`}
        </Text>
      </View>

      {journey.legs.map((leg, i) => (
        <Leg key={leg.order} leg={leg} isLast={i === journey.legs.length - 1} />
      ))}
    </Card>
  );
}

function Leg({ leg, isLast }: { leg: JourneyLeg; isLast: boolean }) {
  return (
    <View className="flex-row">
      <View className="mr-3 items-center">
        <View className="h-3 w-3 rounded-full bg-primary" />
        {!isLast ? <View className="my-1 w-0.5 flex-1 bg-border dark:bg-border-dark" /> : null}
      </View>

      <View className="flex-1 pb-4">
        <View className="flex-row items-center">
          <Text className="font-sans-semibold text-sm text-ink dark:text-ink-dark">
            {formatClock(leg.departureAt)}
          </Text>
          <Text className="ml-2 flex-1 font-sans text-sm text-ink dark:text-ink-dark">
            {leg.from.stopName}
          </Text>
        </View>

        <View className="my-2 flex-row items-center">
          <TransportIcon type={leg.type} size={16} />
          <View className="ml-2">
            <LineBadge name={leg.lineName} color={leg.lineColor} size="sm" />
          </View>
          {leg.intermediateStops.length > 0 ? (
            <Text className="ml-2 flex-1 font-sans text-xs text-ink-placeholder">
              {leg.intermediateStops.length} arrêt{leg.intermediateStops.length > 1 ? "s" : ""} ·{" "}
              {leg.intermediateStops.map((s) => s.stopName).join(", ")}
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center">
          <Text className="font-sans-semibold text-sm text-ink dark:text-ink-dark">
            {formatClock(leg.arrivalAt)}
          </Text>
          <Text className="ml-2 flex-1 font-sans text-sm text-ink dark:text-ink-dark">
            {leg.to.stopName}
          </Text>
        </View>
      </View>
    </View>
  );
}
