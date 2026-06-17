import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./Button";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export function Loading({ label = "Chargement…" }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size="large" color="#6912E2" />
      <Text className="mt-3 font-sans text-ink-muted dark:text-ink-dark-muted">
        {label}
      </Text>
    </View>
  );
}

export function EmptyState({
  icon = "inbox-outline",
  title,
  subtitle,
  onRetry,
  retryLabel = "Réessayer",
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <MaterialCommunityIcons name={icon} size={48} color="#AEAEB2" />
      <Text className="mt-3 text-center font-sans-semibold text-base text-ink dark:text-ink-dark">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-center font-sans text-sm text-ink-muted dark:text-ink-dark-muted">
          {subtitle}
        </Text>
      ) : null}
      {onRetry ? (
        <Button
          title={retryLabel}
          variant="secondary"
          icon="refresh"
          onPress={onRetry}
          className="mt-5"
        />
      ) : null}
    </View>
  );
}
