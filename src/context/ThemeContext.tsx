import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";
import { colorScheme as nwColorScheme } from "nativewind";
import * as SecureStore from "../utils/storage";


const PREF_KEY = "transport.theme";

type ThemeMode = "system" | "light" | "dark";
type Scheme = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: Scheme;
  isDark: boolean;
  setThemeMode: (next: ThemeMode) => Promise<void>;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [systemScheme, setSystemScheme] = useState<Scheme>(
    (Appearance.getColorScheme() as Scheme) || "light"
  );

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(PREF_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        setMode(stored);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme((colorScheme as Scheme) || "light");
    });
    return () => sub.remove();
  }, []);

  const resolved: Scheme = mode === "system" ? systemScheme : mode;

  useEffect(() => {
    nwColorScheme.set(mode === "system" ? "system" : mode);
  }, [mode]);

  const setThemeMode = useCallback(async (next: ThemeMode) => {
    setMode(next);
    await SecureStore.setItemAsync(PREF_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setThemeMode(resolved === "dark" ? "light" : "dark");
  }, [resolved, setThemeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolved,
      isDark: resolved === "dark",
      setThemeMode,
      toggle,
    }),
    [mode, resolved, setThemeMode, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
