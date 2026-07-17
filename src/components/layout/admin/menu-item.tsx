"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { Link, usePathname } from "@/app/i18n/navigation";
import { cn } from "@/lib/utils";

import type { MenuItem as MenuItemType } from "./types";

interface MenuItemProps {
  item: MenuItemType;
  level?: number;
  isCollapsed: boolean;
  openMenuIds: Set<string>;
  onToggle: (id: string) => void;
  onNavigate?: () => void;
}

export const MenuItem = ({
  item,
  level = 0,
  isCollapsed,
  openMenuIds,
  onToggle,
  onNavigate,
}: MenuItemProps) => {
  // next-intl usePathname returns path without the locale prefix.
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;
  const isActive = !!item.href && item.href === pathname;
  const isOpen = openMenuIds.has(item.id);
  const isParentActive = item.children?.some((child) => {
    if (child.href === pathname) return true;
    if (child.children) {
      return child.children.some((subChild) => subChild.href === pathname);
    }
    return false;
  });

  const handleClick = () => {
    if (hasChildren) {
      onToggle(item.id);
    }
  };

  const baseClasses = cn(
    "flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer",
    "hover:bg-slate-100 dark:hover:bg-slate-800",
    {
      "px-3 py-2.5": level === 0,
      "px-3 py-2 ml-4": level === 1,
      "px-3 py-1.5 ml-8": level === 2,
      "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium":
        isActive,
      "text-slate-900 dark:text-slate-100": isParentActive && !isActive,
      "text-slate-600 dark:text-slate-400": !isActive && !isParentActive,
      "justify-center px-2": isCollapsed && level === 0,
    },
  );

  const iconClasses = cn("shrink-0", {
    "w-5 h-5": level === 0,
    "w-4 h-4": level === 1,
    "w-3.5 h-3.5": level === 2,
  });

  const IconComponent = item.icon;

  const renderContent = () => (
    <>
      {IconComponent && <IconComponent className={iconClasses} />}
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm truncate">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <span className="shrink-0">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </>
      )}
    </>
  );

  return (
    <div>
      {item.href && !hasChildren ? (
        <Link href={item.href} className={baseClasses} onClick={onNavigate}>
          {renderContent()}
        </Link>
      ) : (
        <div
          className={baseClasses}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClick();
            }
          }}
          aria-expanded={hasChildren ? isOpen : undefined}
        >
          {renderContent()}
        </div>
      )}

      {hasChildren && isOpen && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              level={level + 1}
              isCollapsed={isCollapsed}
              openMenuIds={openMenuIds}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
