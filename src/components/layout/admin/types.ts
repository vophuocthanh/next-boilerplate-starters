import { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  badge?: string;
  children?: MenuItem[];
}

export interface SidebarState {
  isCollapsed: boolean;
  openMenuIds: Set<string>;
}

export interface DashboardTranslations {
  dashboard: string;
  users: string;
  settings: string;
  search: string;
  notifications: string;
  logout: string;
  totalUsers: string;
  activeUsers: string;
  revenue: string;
  conversion: string;
  recentActivity: string;
  menu: {
    dashboard: string;
    analytics: string;
    users: string;
    userList: string;
    userRoles: string;
    userPermissions: string;
    products: string;
    productList: string;
    categories: string;
    inventory: string;
    orders: string;
    reports: string;
    salesReport: string;
    userReport: string;
    settings: string;
    generalSettings: string;
    security: string;
    profile: string;
  };
  sidebar: {
    collapse: string;
    expand: string;
  };
  topbar: {
    search: string;
    viewProfile: string;
    account: string;
    logout: string;
  };
}
