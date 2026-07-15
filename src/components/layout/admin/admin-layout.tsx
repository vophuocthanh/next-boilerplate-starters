"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { HeaderAdmin } from "./header-admin";
import { DashboardTranslations } from "./types";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  translations: DashboardTranslations;
}

export const AdminLayout = ({ children, translations }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        translations={translations}
        isCollapsed={isCollapsed}
        onToggleCollapse={setIsCollapsed}
      />

      <div
        className={cn("transition-all duration-300", {
          "md:pl-64": !isCollapsed,
          "md:pl-16": isCollapsed,
        })}
      >
        <HeaderAdmin translations={translations} isCollapsed={isCollapsed} />

        <main className="pt-16">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
