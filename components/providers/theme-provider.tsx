"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  applyTheme,
  isTheme,
  readStoredTheme,
  themeConfig as defaultConfig,
  THEMES,
  type ResolvedTheme,
  type Theme,
  type ThemeConfig,
} from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

type ThemeContextValue = {
  /** What the user picked: "light" | "dark" | "system". */
  theme: Theme;
  /** What is actually on `<html>` right now: "light" | "dark". */
  resolvedTheme: ResolvedTheme;
  /**
   * Takes any string, because UI controls (ToggleGroup, Select, …) hand over
   * plain strings. Anything unsupported falls back to the default theme.
   */
  setTheme: (theme: string) => void;
  themes: readonly Theme[];
  /** Current OS preference, tracked while `enableSystem` is on. */
  systemTheme: ResolvedTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* External store                                                            */
/*                                                                            */
/* The theme lives in localStorage, so it is read through                    */
/* `useSyncExternalStore`: no setState-in-effect, no cascading render, and    */
/* the server snapshot keeps hydration clean.                                 */
/* -------------------------------------------------------------------------- */

const themeListeners = new Set<() => void>();
const systemListeners = new Set<() => void>();

/** Used when localStorage cannot be written (private mode, blocked cookies). */
let fallbackTheme: Theme | undefined;

let storageBound = false;
let darkQuery: MediaQueryList | undefined;

function emit() {
  for (const listener of themeListeners) listener();
}

function readTheme(config: ThemeConfig) {
  return fallbackTheme ?? readStoredTheme(config);
}

/** Narrows an arbitrary value (localStorage, UI control) to a usable theme. */
function resolveTheme(value: unknown, config: ThemeConfig): Theme {
  return isTheme(value) && (value !== "system" || config.enableSystem)
    ? value
    : config.defaultTheme;
}

function subscribeToTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);

  if (!storageBound) {
    storageBound = true;
    // Another tab writing the key fires this in every other tab.
    window.addEventListener("storage", emit);
  }

  return () => {
    themeListeners.delete(onStoreChange);

    if (themeListeners.size === 0) {
      window.removeEventListener("storage", emit);
      storageBound = false;
    }
  };
}

function subscribeToSystemTheme(onStoreChange: () => void) {
  systemListeners.add(onStoreChange);

  darkQuery ??= window.matchMedia(DARK_QUERY);
  darkQuery.addEventListener("change", onStoreChange);

  return () => {
    systemListeners.delete(onStoreChange);

    if (systemListeners.size === 0) {
      darkQuery?.removeEventListener("change", onStoreChange);
      darkQuery = undefined;
    }
  };
}

function readSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export type ThemeProviderProps = Partial<ThemeConfig> & {
  children: React.ReactNode;
  /** Kill CSS transitions while the theme class swaps. */
  disableTransitionOnChange?: boolean;
};

/**
 * Replaces `next-themes`, which renders its bootstrap `<script>` from inside a
 * client component: React never executes scripts produced while rendering on
 * the client and logs "Encountered a script tag while rendering React
 * component". That script now lives in the server-rendered `<ThemeScript />`,
 * this provider only mirrors it into React state.
 */
export function ThemeProvider({
  children,
  storageKey = defaultConfig.storageKey,
  defaultTheme = defaultConfig.defaultTheme,
  enableSystem = defaultConfig.enableSystem,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const config = useMemo<ThemeConfig>(
    () => ({ storageKey, defaultTheme, enableSystem }),
    [storageKey, defaultTheme, enableSystem],
  );

  const getTheme = useCallback(() => readTheme(config), [config]);
  const getServerTheme = useCallback(() => config.defaultTheme, [config]);
  const getServerSystemTheme = useCallback(
    () => (config.defaultTheme === "dark" ? "dark" : "light") as ResolvedTheme,
    [config.defaultTheme],
  );

  const theme = useSyncExternalStore(
    subscribeToTheme,
    getTheme,
    getServerTheme,
  );
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    readSystemTheme,
    getServerSystemTheme,
  );

  // `<html>` is the source of truth for styling, so keep it in step with state.
  useEffect(() => {
    applyTheme(theme, config, disableTransitionOnChange);
  }, [theme, config, disableTransitionOnChange]);

  const setTheme = useCallback(
    (value: string) => {
      const next = resolveTheme(value, config);

      try {
        window.localStorage.setItem(config.storageKey, next);
        fallbackTheme = undefined;
      } catch {
        // Storage is unavailable: keep the choice in memory for this visit.
        fallbackTheme = next;
      }

      emit();
    },
    [config],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme === "system" ? systemTheme : theme,
      setTheme,
      themes: THEMES,
      systemTheme,
    }),
    [theme, systemTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider />");
  }

  return context;
}