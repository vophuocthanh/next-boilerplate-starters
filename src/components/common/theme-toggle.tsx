"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0 text-slate-700 dark:text-slate-300"
        disabled
        aria-hidden
      >
        <Sun className="w-4 h-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const handleToggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="w-9 h-9 p-0 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 relative overflow-hidden"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-200">
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </span>
    </Button>
  );
};
