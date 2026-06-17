import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import * as Location from "expo-location";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../components/Screen";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { formatClock } from "../../utils/time";
import { stopsApi } from "../../api/stops";
import { TimeMode } from "../../utils/types/domainModels";
import { JourneyStackParamList } from "../../utils/types/StackParamList/journeyStackParamList";
import { StopSummary } from "../../utils/types/Stops/stopSummary";

type Props = NativeStackScreenProps<JourneyStackParamList, "Planner">;
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export default function PlannerScreen({ navigation, route }: Props) {
  const [fromStop, setFromStop] = useState<StopSummary | null>(null);
  const [toStop, setToStop] = useState<StopSummary | null>(null);
  const [mode, setMode] = useState<TimeMode>("departure");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Receive the stop chosen on the StopPicker screen.
  useEffect(() => {
    const picked = route.params?.picked;
    const field = route.params?.field;
    if (picked && field) {
      if (field === "from") setFromStop(picked);
      else setToStop(picked);
      navigation.setParams({ picked: undefined, field: undefined });
    }
  }, [route.params?.picked, route.params?.field, navigation]);

  const openPicker = (field: "from" | "to") =>
    navigation.navigate("StopPicker", { field });

  const useMyLocation = useCallback(async () => {
    setLocationError(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission de localisation refusée.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { stops } = await stopsApi.nearest({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        limit: 1,
      });
      if (stops && stops.length > 0) setFromStop(stops[0]);
      else setLocationError("Aucun arrêt à proximité.");
    } catch (e) {
      setLocationError((e as Error).message || "Localisation impossible.");
    } finally {
      setLocating(false);
    }
  }, []);

  const swap = () => {
    setFromStop(toStop);
    setToStop(fromStop);
  };

  const onChangeDate = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selected) setDate(selected);
  };

  const search = () => {
    if (!fromStop || !toStop) return;
    navigation.navigate("JourneyResults", {
      fromStop,
      toStop,
      mode,
      datetime: date.toISOString(),
    });
  };

  const sameStop = !!fromStop && !!toStop && fromStop.id === toStop.id;
  const canSearch = !!fromStop && !!toStop && !sameStop;

  return (
    <Screen>
      <ScrollView className="px-4 pt-4" keyboardShouldPersistTaps="handled">
        <Card className="mb-4">
          <StopRow
            icon="circle-outline"
            iconColor="#34C759"
            label="Départ"
            stop={fromStop}
            onPress={() => openPicker("from")}
          />
          <View className="my-2 flex-row items-center">
            <View className="ml-1 h-px flex-1 bg-border dark:bg-border-dark" />
            <Pressable
              onPress={swap}
              className="mx-2 rounded-full bg-subtle p-2 active:opacity-70 dark:bg-card-dark"
            >
              <MaterialCommunityIcons name="swap-vertical" size={18} color="#6912E2" />
            </Pressable>
            <View className="mr-1 h-px flex-1 bg-border dark:bg-border-dark" />
          </View>
          <StopRow
            icon="map-marker"
            iconColor="#FF3B30"
            label="Arrivée"
            stop={toStop}
            onPress={() => openPicker("to")}
          />
        </Card>

        <Button
          title={locating ? "Localisation…" : "Partir de ma position"}
          variant="secondary"
          icon="crosshairs-gps"
          loading={locating}
          onPress={useMyLocation}
          className="mb-2"
        />
        {locationError ? (
          <Text className="mb-2 text-center font-sans text-xs text-error">
            {locationError}
          </Text>
        ) : null}

        <Card className="mb-4 mt-2">
          <Text className="mb-2 font-sans-medium text-sm text-ink-muted dark:text-ink-dark-muted">
            Horaire
          </Text>
          <View className="mb-3 flex-row rounded-xl bg-subtle p-1 dark:bg-card-dark">
            <Segment label="Départ à" active={mode === "departure"} onPress={() => setMode("departure")} />
            <Segment label="Arrivée à" active={mode === "arrival"} onPress={() => setMode("arrival")} />
          </View>

          <Pressable
            onPress={() => setShowPicker((s) => !s)}
            className="flex-row items-center justify-between rounded-xl border border-border px-4 py-3 dark:border-border-dark"
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={18} color="#6912E2" />
              <Text className="ml-2 font-sans text-base text-ink dark:text-ink-dark">
                {formatClock(date.toISOString())}
              </Text>
            </View>
            <Text className="font-sans text-xs text-ink-placeholder">Modifier</Text>
          </Pressable>

          {showPicker ? (
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
            />
          ) : null}
        </Card>

        <Button title="Rechercher un itinéraire" icon="magnify" disabled={!canSearch} onPress={search} />
        {sameStop ? (
          <Text className="mt-2 text-center font-sans text-xs text-warning">
            Le départ et l'arrivée doivent être différents.
          </Text>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function StopRow({
  icon,
  iconColor,
  label,
  stop,
  onPress,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  stop: StopSummary | null;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-1.5 active:opacity-70">
      <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      <View className="ml-3 flex-1">
        <Text className="font-sans text-xs text-ink-placeholder">{label}</Text>
        <Text
          numberOfLines={1}
          className={`text-base ${
            stop
              ? "font-sans-semibold text-ink dark:text-ink-dark"
              : "font-sans text-ink-placeholder"
          }`}
        >
          {stop ? stop.name : "Choisir un arrêt"}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#AEAEB2" />
    </Pressable>
  );
}

function Segment({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
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
