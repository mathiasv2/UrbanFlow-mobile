import { DepartureStatus, Occupancy, Severity, TransportType, VehicleStatus } from "../utils/types/domainModels";

type IconName = string; 

interface TypeMeta {
  label: string;
  icon: IconName;
  color: string;
}

export const TRANSPORT_TYPES: Record<TransportType, TypeMeta> = {
  metro: { label: "Métro", icon: "subway-variant", color: "#6912E2" },
  bus: { label: "Bus", icon: "bus", color: "#007AFF" },
  tram: { label: "Tram", icon: "tram", color: "#34C759" },
  rer: { label: "RER", icon: "train", color: "#5A0DC0" },
  train: { label: "Train", icon: "train-variant", color: "#6E6E73" },
};

export function getTypeMeta(type: TransportType | string): TypeMeta {
  return (
    TRANSPORT_TYPES[type as TransportType] || {
      label: type || "Transport",
      icon: "map-marker-path",
      color: "#6E6E73",
    }
  );
}

export type StatusKey = "on_time" | "delayed" | "cancelled";

export interface StatusMeta {
  key: StatusKey;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  text: string;
  dot: string;
}

export const STATUS_META: Record<StatusKey, StatusMeta> = {
  on_time: {
    key: "on_time",
    label: "À l'heure",
    emoji: "🟢",
    color: "#34C759",
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
  },
  delayed: {
    key: "delayed",
    label: "Retardé",
    emoji: "🟠",
    color: "#FF9F0A",
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  cancelled: {
    key: "cancelled",
    label: "Supprimé",
    emoji: "🔴",
    color: "#FF3B30",
    bg: "bg-error/10",
    text: "text-error",
    dot: "bg-error",
  },
};

export function getStatusMeta(
  status: DepartureStatus | VehicleStatus | string
): StatusMeta {
  if (status === "cancelled" || status === "cancellation") {
    return STATUS_META.cancelled;
  }
  if (status === "delayed") return STATUS_META.delayed;
  return STATUS_META.on_time;
}

export function getSeverityMeta(severity: Severity | string): StatusMeta {
  switch (severity) {
    case "high":
      return STATUS_META.cancelled;
    case "medium":
      return STATUS_META.delayed;
    default:
      return STATUS_META.on_time;
  }
}

interface OccupancyMeta {
  label: string;
  icon: IconName;
  color: string;
}

export const OCCUPANCY_META: Record<Occupancy, OccupancyMeta> = {
  low: { label: "Peu rempli", icon: "account", color: "#34C759" },
  medium: { label: "Modéré", icon: "account-multiple", color: "#FF9F0A" },
  high: { label: "Bondé", icon: "account-group", color: "#FF3B30" },
};

export function getOccupancyMeta(
  occupancy: Occupancy | string
): OccupancyMeta | null {
  return OCCUPANCY_META[occupancy as Occupancy] || null;
}

export function contrastTextColor(hex?: string): string {
  if (!hex) return "#FFFFFF";
  const c = hex.replace("#", "");
  const full =
    c.length === 3
      ? c
          .split("")
          .map((x) => x + x)
          .join("")
      : c;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0A0A0A" : "#FFFFFF";
}
