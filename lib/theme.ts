/**
 * Theme core shared by the client provider and the inline bootstrap <script>.
 *
 * `readStoredTheme` and `applyTheme` are serialised with `.toString()` into the
 * bootstrap <script> (see `components/providers/theme-script.tsx`), so they
 * MUST stay self-contained: no imports, no module-scope references (the script
 * runs outside the bundle), no bundler magic. Only the arguments they receive
 * can be referenced.
 */

export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

/** "system" already resolved to the OS preference. */
export type ResolvedTheme = Exclude<Theme, "system">;

export type ThemeConfig = {
  /** localStorage key holding "light" | "dark" | "system". */
  storageKey: string;
  defaultTheme: Theme;
  enableSystem: boolean;
};

/**
 * Single source of truth, spread into both `<ThemeScript>` and
 * `<ThemeProvider>` so the pre-hydration script and the provider can never
 * disagree on the storage key or the default theme.
 *
 * The project is dark by default: a visitor with nothing stored (or with an
 * unusable stored value) always gets dark. Light and system are opt-in through
 * the theme toggle.
 */
export const themeConfig = {
  storageKey: "theme",
  defaultTheme: "dark",
  enableSystem: true,
} as const satisfies ThemeConfig;

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Reads the persisted theme, falling back to `config.defaultTheme`.
 *
 * Inline script — keep self-contained.
 */
export function readStoredTheme(config: ThemeConfig): Theme {
  let stored: string | null = null;

  try {
    stored = window.localStorage.getItem(config.storageKey);
  } catch {
    // localStorage unavailable (private mode, blocked cookies, SSR safety).
  }

  if (stored === "light" || stored === "dark") return stored;
  if (stored === "system" && config.enableSystem) return "system";

  return config.defaultTheme;
}

/**
 * Writes the theme onto `<html>` as a class (`light` / `dark`) plus the
 * matching `color-scheme`, so native widgets and scrollbars follow the theme.
 *
 * Inline script — keep self-contained.
 */
export function applyTheme(
  theme: Theme,
  config: ThemeConfig,
  disableTransitionOnChange?: boolean,
): ResolvedTheme {
  const resolved: ResolvedTheme =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark"
      : "light";

  let transitions: HTMLStyleElement | undefined;

  if (disableTransitionOnChange) {
    transitions = document.createElement("style");
    transitions.textContent =
      "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(transitions);
  }

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;

  if (transitions) {
    // Flush the class change, then restore transitions once it is committed.
    if (document.body) void window.getComputedStyle(document.body).color;
    requestAnimationFrame(() => transitions?.remove());
  }

  return resolved;
}