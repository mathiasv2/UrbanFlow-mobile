import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Cross-platform secure-ish key/value storage.
 *
 * - Native (iOS/Android) → expo-secure-store (Keychain / Keystore), as required
 *   by the cahier des charges §5.
 * - Web → expo-secure-store has no web implementation, so we fall back to
 *   localStorage to keep the web target from crashing in development.
 *
 * Exported names mirror SecureStore so call sites stay unchanged.
 */
const isWeb = Platform.OS === "web";

export async function getItemAsync(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  if (isWeb) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
