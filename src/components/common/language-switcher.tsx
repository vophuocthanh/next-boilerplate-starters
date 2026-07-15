"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  getI18nPath,
  locales,
  removeLocaleFromPathname,
  type Locale,
} from "@/app/i18n/config/settings";
import { setLocaleCookie } from "@/core/utils/storage";
import { useClickOutside } from "@/hooks/use-click-outside";

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
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleLanguageChange = (newLocale: Locale) => {
    setLocaleCookie(newLocale);
    router.push(getI18nPath(newLocale, removeLocaleFromPathname(pathname)));
    router.refresh();
    setIsOpen(false);
  };

  const currentLocale = localeLabels[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white rounded-lg transition-colors"
        aria-label={t("language")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="hidden sm:inline">{currentLocale.flag}</span>
        <span className="hidden sm:inline">{currentLocale.name}</span>
        <span className="sm:hidden">{currentLocale.flag}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50"
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              {locales.map((loc) => {
                const localeData = localeLabels[loc];
                const isActive = locale === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => handleLanguageChange(loc)}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    role="menuitem"
                  >
                    <span>{localeData.flag}</span>
                    <span>{localeData.name}</span>
                    {isActive && <span className="ml-auto text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
