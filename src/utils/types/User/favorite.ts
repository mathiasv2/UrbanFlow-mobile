export interface Favorite {
  id: number;
  type: "line" | "stop";
  refId: number;
  label: string;
  color?: string;
  createdAt: string;
}