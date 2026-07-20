"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/core/constant/theme";

type ThemeSnapshot = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
};

type ThemeContextValue = ThemeSnapshot & {
  setTheme: (theme: Theme) => void;
  themes: readonly Theme[];
};

const MEDIA_QUERY = "(prefers-color-scheme: dark)";
const THEMES = ["light", "dark", "system"] as const satisfies readonly Theme[];

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // private mode / blocked storage
  }
  return DEFAULT_THEME;
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyThemeClass(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

const SERVER_SNAPSHOT: ThemeSnapshot = {
  theme: DEFAULT_THEME,
  resolvedTheme: "light",
};

let snapshot: ThemeSnapshot = SERVER_SNAPSHOT;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function commit(theme: Theme) {
  const resolvedTheme = resolveTheme(theme);
  snapshot = { theme, resolvedTheme };
  applyThemeClass(resolvedTheme);
  emit();
}

function getClientSnapshot(): ThemeSnapshot {
  return snapshot;
}

function getServerSnapshot(): ThemeSnapshot {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(MEDIA_QUERY);
  const onMediaChange = () => {
    if (snapshot.theme !== "system") {
      return;
    }
    commit("system");
  };
  media.addEventListener("change", onMediaChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) {
      return;
    }
    commit(readStoredTheme());
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onMediaChange);
    window.removeEventListener("storage", onStorage);
  };
}

function setTheme(next: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // ignore
  }
  commit(next);
}

if (typeof window !== "undefined") {
  const theme = readStoredTheme();
  snapshot = { theme, resolvedTheme: resolveTheme(theme) };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme } = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      themes: THEMES,
    }),
    [theme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Client hook for reading / updating the active color theme. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
