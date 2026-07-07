"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { locales, type Locale } from "@/app/i18n/config/settings";
import { useClickOutside } from "@/hooks/use-click-outside";
import { localeLabels } from "./helpers";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { setLocaleCookie } from "@/core/utils/storage";

export const LanguageSwitcher = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleLanguageChange = (newLocale: Locale) => {
    setLocaleCookie(newLocale);

    const segments = pathname.split(ROUTE_CONSTANTS.HOME);
    segments[1] = newLocale as string;
    const newPath = segments.join(ROUTE_CONSTANTS.HOME);
    router.push(newPath);
    router.refresh();
    setIsOpen(false);
  };

  const currentLocale = localeLabels[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300  hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white rounded-lg transition-colors"
        aria-label={t("language")}
      >
        <span className="hidden sm:inline mt-1">{currentLocale.flag}</span>
        <span className="hidden sm:inline">{currentLocale.name}</span>
        <span className="sm:hidden mt-1">{currentLocale.flag}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-lg z-50"
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
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                    role="menuitem"
                  >
                    <span className="mt-1">{localeData.flag}</span>
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
