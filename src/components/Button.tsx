import React from "react";
import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const VARIANTS: Record<
  Variant,
  { container: string; text: string; icon: string }
> = {
  primary: {
    container: "bg-primary active:bg-primary-hover",
    text: "text-primary-foreground",
    icon: "#FFFFFF",
  },
  secondary: {
    container:
      "bg-subtle active:bg-border dark:bg-card-dark dark:active:bg-border-dark",
    text: "text-ink dark:text-ink-dark",
    icon: "#6912E2",
  },
  ghost: {
    container: "bg-transparent active:bg-primary-light dark:active:bg-card-dark",
    text: "text-primary",
    icon: "#6912E2",
  },
  danger: {
    container: "bg-error active:opacity-80",
    text: "text-white",
    icon: "#FFFFFF",
  },
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const v = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center rounded-xl px-5 py-3.5 ${
        v.container
      } ${isDisabled ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={v.icon} />
      ) : (
        <View className="flex-row items-center">
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={v.icon}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text className={`font-sans-semibold text-base ${v.text}`}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
