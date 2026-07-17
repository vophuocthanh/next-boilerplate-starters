"use client";

import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { getMenuItems } from "./menu-config";
import { MenuItem } from "./menu-item";
import type { DashboardTranslations, MenuItem as MenuItemType } from "./types";

interface SidebarProps {
  translations: DashboardTranslations;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({
  translations,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const [openMenuIds, setOpenMenuIds] = useState<Set<string>>(new Set());

  const menuItems: MenuItemType[] = useMemo(
    () => getMenuItems(translations),
    [translations],
  );

  const handleToggleMenu = (id: string) => {
    setOpenMenuIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
    if (!isCollapsed) {
      setOpenMenuIds(new Set());
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "border-r border-slate-200 dark:border-slate-800",
        "bg-white dark:bg-slate-900",
        // Desktop width
        {
          "md:w-64": !isCollapsed,
          "md:w-16": isCollapsed,
        },
        // Mobile drawer
        "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed || isMobileOpen ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span
                className={cn(
                  "font-semibold text-slate-900 dark:text-slate-100",
                  isCollapsed && "md:hidden",
                )}
              >
                Admin
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onMobileClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleToggleSidebar}
                className="hidden md:inline-flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={translations.sidebar.collapse}
                title={translations.sidebar.collapse}
              >
                <PanelLeftClose className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="hidden md:inline-flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
            aria-label={translations.sidebar.expand}
            title={translations.sidebar.expand}
          >
            <PanelLeftOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}
      </div>

      <nav className="p-3 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              level={0}
              isCollapsed={isCollapsed && !isMobileOpen}
              openMenuIds={openMenuIds}
              onToggle={handleToggleMenu}
              onNavigate={onMobileClose}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};
