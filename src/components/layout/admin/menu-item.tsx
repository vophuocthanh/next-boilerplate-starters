"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem as MenuItemType } from "./types";

interface MenuItemProps {
  item: MenuItemType;
  level?: number;
  isCollapsed: boolean;
  onToggle?: (id: string) => void;
  isOpen?: boolean;
}

export const MenuItem = ({
  item,
  level = 0,
  isCollapsed,
  onToggle,
  isOpen = false,
}: MenuItemProps) => {
  const pathname = usePathname();
  const [localOpen, setLocalOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname;
  const isParentActive = item.children?.some((child) => {
    if (child.href === pathname) return true;
    if (child.children) {
      return child.children.some((subChild) => subChild.href === pathname);
    }
    return false;
  });

  const handleClick = () => {
    if (hasChildren) {
      if (onToggle) {
        onToggle(item.id);
      } else {
        setLocalOpen(!localOpen);
      }
    }
  };

  const effectiveOpen = onToggle ? isOpen : localOpen;

  // Màu sắc chuyên nghiệp, không lòe loẹt
  const baseClasses = cn(
    "flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer",
    "hover:bg-slate-100 dark:hover:bg-slate-800",
    {
      // Level 0 - Menu chính
      "px-3 py-2.5": level === 0,
      // Level 1 - Menu cấp 2
      "px-3 py-2 ml-4": level === 1,
      // Level 2 - Menu cấp 3
      "px-3 py-1.5 ml-8": level === 2,
      // Active state
      "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium":
        isActive,
      // Parent active state
      "text-slate-900 dark:text-slate-100": isParentActive && !isActive,
      // Default state
      "text-slate-600 dark:text-slate-400": !isActive && !isParentActive,
      // Collapsed state
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
              {effectiveOpen ? (
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
        <Link href={item.href} className={baseClasses}>
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
          aria-expanded={hasChildren ? effectiveOpen : undefined}
        >
          {renderContent()}
        </div>
      )}

      {/* Render children với animation */}
      {hasChildren && effectiveOpen && !isCollapsed && (
        <div
          className={cn(
            "mt-1 space-y-1 overflow-hidden transition-all duration-200",
            {
              "opacity-100": effectiveOpen,
              "opacity-0": !effectiveOpen,
            },
          )}
        >
          {item.children?.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              level={level + 1}
              isCollapsed={isCollapsed}
              onToggle={onToggle}
              isOpen={onToggle ? isOpen : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};
