/** Time helpers for departures / journeys. */

// "08:42"
export function formatClock(iso?: string): string {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// Whole minutes from now until `iso` (negative if in the past).
export function minutesUntil(iso?: string, from: number = Date.now()): number {
  if (!iso) return 0;
  const diffMs = new Date(iso).getTime() - from;
  return Math.round(diffMs / 60000);
}

/**
 * Human "dans X min" countdown label.
 *  - <= 0     → "à quai"
 *  - < 1 min  → "imminent"
 *  - < 60 min → "X min"
 *  - else     → clock time
 */
export function countdownLabel(iso?: string, from: number = Date.now()): string {
  if (!iso) return "--";
  const mins = minutesUntil(iso, from);
  if (mins <= 0) return "à quai";
  if (mins < 1) return "imminent";
  if (mins < 60) return `${mins} min`;
  return formatClock(iso);
}

// "1 h 30" / "45 min"
export function formatDuration(totalMinutes?: number): string {
  if (totalMinutes == null) return "--";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${String(m).padStart(2, "0")}`;
}

// "il y a 5 min" / "il y a 2 h"
export function timeAgo(iso?: string, from: number = Date.now()): string {
  if (!iso) return "";
  const mins = Math.round((from - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}
