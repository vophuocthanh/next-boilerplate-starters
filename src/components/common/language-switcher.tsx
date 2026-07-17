"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import type { Locale } from "@/app/i18n/config/settings";
import { locales } from "@/app/i18n/config/settings";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import { setLocaleCookie } from "@/core/utils/storage";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, { name: string; flag: string }> = {
  vi: { name: "Tiếng Việt", flag: "🇻🇳" },
  en: { name: "English", flag: "🇺🇸" },
};

export const LanguageSwitcher = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setLocaleCookie(newLocale);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    });
    setIsOpen(false);
  };

  const currentLocale = localeLabels[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white rounded-lg transition-colors",
          isPending && "opacity-60",
        )}
        aria-label={t("language")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={isPending}
      >
        <span className="hidden sm:inline">{currentLocale.flag}</span>
        <span className="hidden sm:inline">{currentLocale.name}</span>
        <span className="sm:hidden">{currentLocale.flag}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50 animate-fade-in"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {locales.map((loc) => {
              const localeData = localeLabels[loc];
              const isActive = locale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleLanguageChange(loc)}
                  className={cn(
                    "flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white",
                  )}
                  role="menuitem"
                >
                  <span>{localeData.flag}</span>
                  <span>{localeData.name}</span>
                  {isActive && <span className="ml-auto text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
