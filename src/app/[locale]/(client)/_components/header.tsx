"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/app/i18n/navigation";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { navItems } from "./helpers";

export const Header = () => {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "";
    }
    if (href.startsWith("#")) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition-all"
          >
            <span className="text-2xl" aria-hidden>
              ⚡
            </span>
            <span className="hidden sm:inline">NextJS Boilerplate</span>
            <span className="sm:hidden">NJB</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t(item.key)}
                </a>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                  )}
                >
                  {t(item.key)}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-800/50 mt-2 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) =>
                item.href.startsWith("#") ? (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t(item.key)}
                  </a>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ),
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
