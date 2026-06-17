import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Screen from "../../components/Screen";
import TransportIcon from "../../components/TransportIcon";
import { Loading, EmptyState } from "../../components/StateView";
import { stopsApi } from "../../api/stops";
import { JourneyStackParamList } from "../../utils/types/StackParamList/journeyStackParamList";
import { StopSummary } from "../../utils/types/Stops/stopSummary";

type Props = NativeStackScreenProps<JourneyStackParamList, "StopPicker">;

export default function StopPickerScreen({ navigation, route }: Props) {
  const { field } = route.params;
  const [query, setQuery] = useState("");
  const [stops, setStops] = useState<StopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
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

  useEffect(() => {
    const id = setTimeout(() => load(query.trim()), 250);
    return () => clearTimeout(id);
  }, [query, load]);

  const pick = (stop: StopSummary) => {
    navigation.navigate({
      name: "Planner",
      params: { picked: stop, field },
      merge: true,
    });
  };

  return (
    <Screen>
      <View className="px-4 pt-3">
        <View className="mb-3 flex-row items-center rounded-xl border border-border bg-card px-3 dark:border-border-dark dark:bg-card-dark">
          <MaterialCommunityIcons name="magnify" size={20} color="#AEAEB2" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un arrêt…"
            placeholderTextColor="#AEAEB2"
            autoFocus
            className="ml-2 flex-1 py-3 font-sans text-base text-ink dark:text-ink-dark"
          />
          {query ? (
            <Pressable onPress={() => setQuery("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#AEAEB2" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {loading ? (
        <Loading label="Chargement des arrêts…" />
      ) : error ? (
        <EmptyState
          icon="wifi-off"
          title="Erreur de chargement"
          subtitle={error}
          onRetry={() => load(query.trim())}
        />
      ) : (
        <FlatList
          data={stops}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-border dark:bg-border-dark" />
          )}
          ListEmptyComponent={
            <EmptyState icon="map-marker-off-outline" title="Aucun arrêt" subtitle="Essayez un autre nom." />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => pick(item)}
              className="flex-row items-center py-3 active:opacity-60"
            >
              <View className="mr-3 flex-row">
                {(item.types || []).slice(0, 2).map((t) => (
                  <View key={t} className="mr-1">
                    <TransportIcon type={t} size={16} />
                  </View>
                ))}
              </View>
              <Text className="flex-1 font-sans text-base text-ink dark:text-ink-dark">
                {item.name}
              </Text>
              <Text className="font-sans text-xs text-ink-placeholder">
                {(item.lines || []).length} ligne{(item.lines || []).length > 1 ? "s" : ""}
              </Text>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
