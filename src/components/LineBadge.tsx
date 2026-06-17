import React from "react";
import { View, Text } from "react-native";
import { contrastTextColor } from "../theme/transport";


export default function LineBadge({
  name,
  color = "#6E6E73",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md";
}) {
  const fg = contrastTextColor(color);
  const pad = size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1";
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View style={{ backgroundColor: color }} className={`self-start rounded-md ${pad}`}>
      <Text style={{ color: fg }} className={`font-sans-bold ${text}`}>
        {name}
      </Text>
    </View>
  );
}
