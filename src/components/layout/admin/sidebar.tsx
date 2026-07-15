"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "./menu-item";
import { getMenuItems } from "./menu-config";
import { MenuItem as MenuItemType, DashboardTranslations } from "./types";

interface SidebarProps {
  translations: DashboardTranslations;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const Sidebar = ({
  translations,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const [openMenuIds, setOpenMenuIds] = useState<Set<string>>(new Set());

  const menuItems: MenuItemType[] = getMenuItems(translations);

  const handleToggleMenu = (id: string) => {
    setOpenMenuIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
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
        {
          "w-64": !isCollapsed,
          "w-16": isCollapsed,
        },
      )}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Admin
              </span>
            </div>
            <button
              onClick={handleToggleSidebar}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={translations.sidebar.collapse}
              title={translations.sidebar.collapse}
            >
              <PanelLeftClose className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </>
        ) : (
          <button
            onClick={handleToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
            aria-label={translations.sidebar.expand}
            title={translations.sidebar.expand}
          >
            <PanelLeftOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="p-3 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              level={0}
              isCollapsed={isCollapsed}
              openMenuIds={openMenuIds}
              onToggle={handleToggleMenu}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};
