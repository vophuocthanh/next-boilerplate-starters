import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  UserCircle,
  Shield,
  ClipboardList,
  FolderTree,
  Warehouse,
} from "lucide-react";
import { MenuItem, DashboardTranslations } from "./types";

export const getMenuItems = (t: DashboardTranslations): MenuItem[] => [
  {
    id: "dashboard",
    label: t.menu.dashboard,
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "analytics",
    label: t.menu.analytics,
    icon: BarChart3,
    href: "/analytics",
  },
  {
    id: "users",
    label: t.menu.users,
    icon: Users,
    children: [
      {
        id: "user-list",
        label: t.menu.userList,
        icon: ClipboardList,
        href: "/users/list",
      },
      {
        id: "user-roles",
        label: t.menu.userRoles,
        icon: Shield,
        href: "/users/roles",
      },
      {
        id: "user-permissions",
        label: t.menu.userPermissions,
        icon: Shield,
        href: "/users/permissions",
      },
    ],
  },
  {
    id: "products",
    label: t.menu.products,
    icon: Package,
    children: [
      {
        id: "product-list",
        label: t.menu.productList,
        icon: ClipboardList,
        href: "/products/list",
      },
      {
        id: "categories",
        label: t.menu.categories,
        icon: FolderTree,
        children: [
          {
            id: "categories-main",
            label: "Main Categories",
            href: "/products/categories/main",
          },
          {
            id: "categories-sub",
            label: "Sub Categories",
            href: "/products/categories/sub",
          },
        ],
      },
      {
        id: "inventory",
        label: t.menu.inventory,
        icon: Warehouse,
        href: "/products/inventory",
      },
    ],
  },
  {
    id: "orders",
    label: t.menu.orders,
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    id: "reports",
    label: t.menu.reports,
    icon: FileText,
    children: [
      {
        id: "sales-report",
        label: t.menu.salesReport,
        href: "/reports/sales",
      },
      {
        id: "user-report",
        label: t.menu.userReport,
        href: "/reports/users",
      },
    ],
  },
  {
    id: "settings",
    label: t.menu.settings,
    icon: Settings,
    children: [
      {
        id: "general-settings",
        label: t.menu.generalSettings,
        href: "/settings/general",
      },
      {
        id: "security",
        label: t.menu.security,
        icon: Shield,
        href: "/settings/security",
      },
      {
        id: "profile",
        label: t.menu.profile,
        icon: UserCircle,
        href: "/settings/profile",
      },
    ],
  },
];
