import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../components/Screen";
import Card from "../../components/Card";
import LineBadge from "../../components/LineBadge";
import DepartureItem from "../../components/DepartureItem";
import IncidentItem from "../../components/IncidentItem";
import { Loading, EmptyState } from "../../components/StateView";
import { useAuth } from "../../context/AuthContext";
import { formatClock } from "../../utils/time";
import { Departure, incidentsApi } from "../../api/incidents";
import { stopsApi } from "../../api/stops";
import { usersApi } from "../../api/users";
import { Incident } from "../../utils/types/incident";
import { StopsStackParamList } from "../../utils/types/StackParamList/stopsStackParamList";
import { StopDetail } from "../../utils/types/Stops/stopDetail";
import { Favorite } from "../../utils/types/User/favorite";

type Props = NativeStackScreenProps<StopsStackParamList, "StopDetail">;

export default function StopDetailScreen({ route, navigation }: Props) {
  const { id, name } = route.params;
  const { token } = useAuth();

  const [stop, setStop] = useState<StopDetail | null>(null);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [favBusy, setFavBusy] = useState(false);

  const load = useCallback(
    async (isManual = false) => {
      setError(null);
      if (isManual) setRefreshing(true);
      else setLoading(true);
      try {
        const [detail, deps, inc] = await Promise.all([
          stopsApi.detail(id),
          stopsApi.departures(id, 15),
          incidentsApi.list({ stopId: id }),
        ]);
        setStop(detail);
        setDepartures(deps.departures || []);
        setUpdatedAt(deps.updatedAt);
        setIncidents(inc.incidents || []);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  useEffect(() => {
    if (!token) return;
    usersApi
      .favorites(token)
      .then(({ favorites }) => {
        const match = (favorites || []).find((f) => f.type === "stop" && f.refId === id);
        setFavorite(match || null);
      })
      .catch(() => {});
  }, [token, id]);

  const toggleFavorite = useCallback(async () => {
    if (favBusy || !token) return;
    setFavBusy(true);
    try {
      if (favorite) {
        await usersApi.removeFavorite(favorite.id, token);
        setFavorite(null);
      } else {
        const fav = await usersApi.addFavorite({ type: "stop", refId: id }, token);
        setFavorite(fav);
      }
    } catch (e) {
      Alert.alert("Favori", (e as Error).message || "Action impossible");
    } finally {
      setFavBusy(false);
    }
  }, [favorite, favBusy, id, token]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name || stop?.name || "Arrêt",
      headerRight: () => (
        <Pressable onPress={toggleFavorite} disabled={favBusy} hitSlop={10}>
          <MaterialCommunityIcons
            name={favorite ? "heart" : "heart-outline"}
            size={22}
            color={favorite ? "#FF3B30" : "#6912E2"}
          />
        </Pressable>
      ),
    });
  }, [navigation, name, stop, favorite, favBusy, toggleFavorite]);

  if (loading) return <Screen><Loading label="Chargement de l'arrêt…" /></Screen>;
  if (error || !stop)
    return (
      <Screen>
        <EmptyState icon="wifi-off" title="Erreur" subtitle={error ?? undefined} onRetry={() => load(true)} />
      </Screen>
    );

  return (
    <Screen>
      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Card className="mb-4">
          <Text className="font-sans-bold text-xl text-ink dark:text-ink-dark">{stop.name}</Text>
          {stop.address ? (
            <Text className="mt-0.5 font-sans text-sm text-ink-muted dark:text-ink-dark-muted">
              {stop.address}
            </Text>
          ) : null}
          <View className="mt-3 flex-row flex-wrap">
            {(stop.lines || []).map((l) => (
              <View key={l.id} className="mb-1.5 mr-1.5">
                <LineBadge name={l.name} color={l.color} size="sm" />
              </View>
            ))}
          </View>
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

        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-sans-semibold text-sm text-ink dark:text-ink-dark">
            Prochains passages
          </Text>
          <Pressable
            onPress={() => load(true)}
            className="flex-row items-center rounded-full bg-primary-light px-3 py-1.5 active:opacity-70 dark:bg-card-dark"
          >
            <MaterialCommunityIcons name="refresh" size={15} color="#6912E2" />
            <Text className="ml-1 font-sans-semibold text-xs text-primary">
              {refreshing ? "…" : "Actualiser"}
            </Text>
          </Pressable>
        </View>

        {updatedAt ? (
          <Text className="mb-1 font-sans text-xs text-ink-placeholder">
            Mis à jour à {formatClock(updatedAt)}
          </Text>
        ) : null}

        <Card>
          {departures.length === 0 ? (
            <Text className="py-4 text-center font-sans text-ink-placeholder">
              Aucun passage à venir.
            </Text>
          ) : (
            departures.map((d, i) => (
              <View key={d.id}>
                {i > 0 ? <View className="h-px bg-border dark:bg-border-dark" /> : null}
                <DepartureItem departure={d} />
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}
