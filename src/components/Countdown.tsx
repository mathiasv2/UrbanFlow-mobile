import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import { countdownLabel } from "../utils/time";

export default function Countdown({
  iso,
  className = "",
  intervalMs = 15000,
}: {
  iso?: string;
  className?: string;
  intervalMs?: number;
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return <Text className={className}>{countdownLabel(iso)}</Text>;
}
