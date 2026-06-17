import { Platform } from "react-native";
import Constants from "expo-constants";

const API_PORT = 3000;

function resolveBaseUrl(): string {
  if (Platform.OS === "web") {
    return `http://localhost:${API_PORT}`;
  }

  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost ||
    "";
  const host = hostUri.split(":")[0];
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:${API_PORT}`;
  }

  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  return extra?.apiUrl || `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();
