import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../components/Screen";
import Card from "../../components/Card";
import LineBadge from "../../components/LineBadge";
import TransportIcon from "../../components/TransportIcon";
import { Loading, EmptyState } from "../../components/StateView";
import type { LineSummary, StopSummary, StopsStackParamList } from "../../types";
import { stopsApi } from "../../api/stops";
import { linesApi } from "../../api/lines";

type Props = NativeStackScreenProps<StopsStackParamList, "Stops">;
type TabKey = "stops" | "lines";


export default function StopsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<TabKey>("stops");
  const [query, setQuery] = useState("");
  const [stops, setStops] = useState<StopSummary[]>([]);
  const [lines, setLines] = useState<LineSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStops = useCallback(async (q: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await stopsApi.list(q);
      setStops(data.stops || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLines = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await linesApi.list();
      setLines(data.lines || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "stops") {
      const id = setTimeout(() => loadStops(query.trim()), 250);
      return () => clearTimeout(id);
    }
    loadLines();
    return undefined;
  }, [tab, query, loadStops, loadLines]);

  return (
    <Screen>
      <View className="px-4 pt-3">
        <View className="mb-3 flex-row rounded-xl bg-subtle p-1 dark:bg-card-dark">
          <Segment label="Arrêts" active={tab === "stops"} onPress={() => setTab("stops")} />
          <Segment label="Lignes" active={tab === "lines"} onPress={() => setTab("lines")} />
        </View>

        {tab === "stops" ? (
          <View className="mb-2 flex-row items-center rounded-xl border border-border bg-card px-3 dark:border-border-dark dark:bg-card-dark">
            <MaterialCommunityIcons name="magnify" size={20} color="#AEAEB2" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un arrêt…"
              placeholderTextColor="#AEAEB2"
              className="ml-2 flex-1 py-3 font-sans text-base text-ink dark:text-ink-dark"
            />
          </View>
        ) : null}
      </View>

      {loading ? (
        <Loading />
      ) : error ? (
        <EmptyState
          icon="wifi-off"
          title="Erreur de chargement"
          subtitle={error}
          onRetry={() => (tab === "stops" ? loadStops(query.trim()) : loadLines())}
        />
      ) : tab === "stops" ? (
        <FlatList
          data={stops}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ListEmptyComponent={<EmptyState icon="map-marker-off-outline" title="Aucun arrêt" />}
          renderItem={({ item }) => (
            <Card
              onPress={() => navigation.navigate("StopDetail", { id: item.id, name: item.name })}
              className="mb-2 flex-row items-center"
            >
              <MaterialCommunityIcons name="bus-stop" size={22} color="#6912E2" />
              <View className="ml-3 flex-1">
                <Text className="font-sans-semibold text-base text-ink dark:text-ink-dark">
                  {item.name}
                </Text>
                <View className="mt-1 flex-row items-center">
                  {(item.types || []).map((t) => (
                    <View key={t} className="mr-1.5">
                      <TransportIcon type={t} size={14} />
                    </View>
                  ))}
                  <Text className="font-sans text-xs text-ink-placeholder">
                    {(item.lines || []).length} ligne{(item.lines || []).length > 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#AEAEB2" />
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={lines}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ListEmptyComponent={<EmptyState icon="transit-connection-variant" title="Aucune ligne" />}
          renderItem={({ item }) => (
            <Card
              onPress={() => navigation.navigate("LineDetail", { id: item.id, name: item.name })}
              className="mb-2 flex-row items-center"
            >
              <TransportIcon type={item.type} size={22} circle />
              <View className="ml-3 flex-1">
                <LineBadge name={item.name} color={item.color} size="sm" />
                <Text className="mt-1 font-sans text-xs text-ink-muted dark:text-ink-dark-muted">
                  {item.from} → {item.to} · {item.stopCount} arrêts
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#AEAEB2" />
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-lg py-2 ${active ? "bg-card dark:bg-border-dark" : ""}`}
    >
      <Text
        className={`font-sans-medium text-sm ${
          active ? "text-ink dark:text-ink-dark" : "text-ink-muted dark:text-ink-dark-muted"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
