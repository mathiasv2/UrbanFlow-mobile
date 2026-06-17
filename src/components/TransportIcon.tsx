import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTypeMeta } from "../theme/transport";
import { TransportType } from "../utils/types/domainModels";

export default function TransportIcon({
  type,
  size = 20,
  color,
  circle = false,
  bgColor,
}: {
  type: TransportType | string;
  size?: number;
  color?: string;
  circle?: boolean;
  bgColor?: string;
}) {
  const meta = getTypeMeta(type);
  const iconColor = color || meta.color;
  const name = meta.icon as React.ComponentProps<
    typeof MaterialCommunityIcons
  >["name"];

  if (!circle) {
    return <MaterialCommunityIcons name={name} size={size} color={iconColor} />;
  }

  return (
    <View
      style={{
        width: size * 1.9,
        height: size * 1.9,
        borderRadius: size,
        backgroundColor: bgColor || `${meta.color}1A`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons name={name} size={size} color={iconColor} />
    </View>
  );
}
