import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Base URL of the transport REST API (port 3000), resolved automatically so you
 * never have to hardcode an IP:
 *
 *  - **Web** → the browser runs on the dev machine, so `localhost:3000` reaches
 *    the API directly.
 *  - **Phone / simulator** → reuse the host of the Metro dev server (your Mac's
 *    current LAN IP, the same one in the QR code) and swap the port to 3000.
 *    This follows network changes on its own — no manual IP needed.
 *  - An explicit `EXPO_PUBLIC_API_URL` always wins on native (e.g. a deployed API):
 *    `EXPO_PUBLIC_API_URL=http://10.0.0.4:3000 npx expo start`
 *
 * The API port is fixed to 3000 (cf. transport-api). Change `API_PORT` if needed.
 */
const API_PORT = 3000;

function resolveBaseUrl(): string {
  // Web: the API lives on the same machine as the browser.
  if (Platform.OS === "web") {
    return `http://localhost:${API_PORT}`;
  }

  // Native: explicit override first.
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Otherwise derive the dev machine's LAN IP from the Metro host.
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost ||
    "";
  const host = hostUri.split(":")[0];
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:${API_PORT}`;
  }

  // Fallback (production build with no override).
  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  return extra?.apiUrl || `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();
