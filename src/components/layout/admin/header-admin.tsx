"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DashboardTranslations } from "./types";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { authApi } from "@/core/service/auth.service";
import { ROUTE_CONSTANTS } from "@/core/constant/route";

interface HeaderAdminProps {
  translations: DashboardTranslations;
  isCollapsed: boolean;
}

export const HeaderAdmin = ({
  translations,
  isCollapsed,
}: HeaderAdminProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      router.push(ROUTE_CONSTANTS.HOME);
      router.refresh();
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300",
        {
          "md:left-64": !isCollapsed,
          "md:left-16": isCollapsed,
        },
      )}
    >
      <div className="h-full px-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={translations.topbar.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 text-sm",
                "bg-slate-100 dark:bg-slate-800",
                "border border-transparent",
                "rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "text-slate-900 dark:text-slate-100",
                "placeholder:text-slate-500 dark:placeholder:text-slate-400",
                "transition-all duration-200",
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={translations.notifications}
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>
                {translations.notifications}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                  <DropdownMenuItem
                    key={item}
                    className="flex flex-col items-start py-3"
                  >
                    <span className="font-medium text-sm">
                      New user registered
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {item} minutes ago
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-medium">AD</span>
                  </div>
                  <div className="hidden md:block text-left min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      Admin
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      admin@example.com
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                alignOffset={-8}
                avoidCollisions={false}
                className="w-56"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  {translations.topbar.viewProfile}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  {translations.topbar.account}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {translations.topbar.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
