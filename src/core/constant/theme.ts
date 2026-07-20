export const THEME_STORAGE_KEY = "theme";

export const THEME_VALUES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEME_VALUES)[number];
export type ResolvedTheme = "light" | "dark";

export const DEFAULT_THEME: Theme = "system";
