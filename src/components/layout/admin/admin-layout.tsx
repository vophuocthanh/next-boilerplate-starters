"use client";

import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { HeaderAdmin } from "./header-admin";
import { Sidebar } from "./sidebar";
import type { DashboardTranslations } from "./types";

interface AdminLayoutProps {
  children: ReactNode;
  translations: DashboardTranslations;
}

export const AdminLayout = ({ children, translations }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer when viewport crosses md (avoids stuck overlay).
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setIsMobileOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileOpen]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Sidebar
        translations={translations}
        isCollapsed={isCollapsed}
        onToggleCollapse={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div
        className={cn("transition-all duration-300", {
          "md:pl-64": !isCollapsed,
          "md:pl-16": isCollapsed,
        })}
      >
        <HeaderAdmin
          translations={translations}
          isCollapsed={isCollapsed}
          onMobileMenuOpen={() => setIsMobileOpen(true)}
        />

        <main className="pt-16">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
