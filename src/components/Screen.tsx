import React from "react";
import { View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";


export default function Screen({
  children,
  className = "",
  edges,
}: {
  children: React.ReactNode;
  className?: string;
  edges?: Edge[];
}) {
  return (
    <SafeAreaView
      edges={edges ?? ["top", "left", "right"]}
      className="flex-1 bg-subtle dark:bg-subtle-dark"
    >
      <View className={`flex-1 ${className}`}>{children}</View>
    </SafeAreaView>
  );
}
