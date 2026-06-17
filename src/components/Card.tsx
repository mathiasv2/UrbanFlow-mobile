import React from "react";
import { View, Pressable } from "react-native";

const SHADOW = {
  shadowColor: "#000000",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export default function Card({children, onPress, className = "",
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}) {
  const base =
    "rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark p-4";

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={SHADOW}
        className={`${base} active:opacity-70 ${className}`}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={SHADOW} className={`${base} ${className}`}>
      {children}
    </View>
  );
}
