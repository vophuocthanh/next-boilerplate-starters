import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/core/constant/theme";

/**
 * Blocking inline script for SSR (root layout only).
 * Runs before paint so the correct light/dark class is on <html> — no FOUC.
 *
 * Must live in a Server Component: React 19 forbids <script> inside
 * client components (the reason next-themes warns in Next 16).
 */
export function ThemeScript() {
  const code = `(function(){
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var stored = localStorage.getItem(key) || ${JSON.stringify(DEFAULT_THEME)};
    var theme = stored === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : stored;
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  } catch (e) {}
})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
