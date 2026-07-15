import { LucideIcon } from "lucide-react";

import type dashboardEn from "@/app/i18n/dictionaries/en/dashboard.json";

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  badge?: string;
  children?: MenuItem[];
}

/**
 * Derived from the English dictionary rather than hand-written, so the type and
 * the JSON can never drift apart.
 */
export type DashboardTranslations = typeof dashboardEn;
