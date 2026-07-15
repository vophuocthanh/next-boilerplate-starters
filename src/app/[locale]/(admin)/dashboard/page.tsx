import { getTranslations } from "@/app/i18n/server";
import {
  Users,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import { DashboardTranslations } from "@/components/layout/admin/types";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const STAT_COLORS = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    icon: "bg-blue-500",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-600 dark:text-green-400",
    icon: "bg-green-500",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    icon: "bg-purple-500",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    icon: "bg-orange-500",
  },
} as const;

type StatColor = keyof typeof STAT_COLORS;

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { locale } = await params;
  const translationsData = await getTranslations(locale, ["dashboard"]);
  const t = translationsData.dashboard as unknown as DashboardTranslations;

  // Demo data
  const stats: Array<{
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: StatColor;
  }> = [
    {
      title: t.totalUsers,
      value: "24,547",
      change: "+12.5%",
      trend: "up" as const,
      icon: Users,
      color: "blue",
    },
    {
      title: t.activeUsers,
      value: "18,432",
      change: "+8.2%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "green",
    },
    {
      title: t.revenue,
      value: "$156,890",
      change: "+15.3%",
      trend: "up" as const,
      icon: DollarSign,
      color: "purple",
    },
    {
      title: t.conversion,
      value: "3.24%",
      change: "-2.1%",
      trend: "down" as const,
      icon: ShoppingCart,
      color: "orange",
    },
  ];

  const recentActivities = [
    { id: 1, action: "User registration", time: "2 minutes ago" },
    { id: 2, action: "New order placed", time: "5 minutes ago" },
    { id: 3, action: "Product updated", time: "10 minutes ago" },
    { id: 4, action: "Payment received", time: "15 minutes ago" },
  ];

  const getColorClasses = (color: StatColor) => STAT_COLORS[color];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t.dashboard}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);

          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm font-medium mt-2 ${
                      stat.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`${colors.bg} p-3 rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {t.recentActivity}
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {activity.action}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add User", icon: Users },
              { label: "New Order", icon: ShoppingCart },
              { label: "View Reports", icon: TrendingUp },
              { label: "Settings", icon: DollarSign },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Sales Overview
        </h2>
        <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-600">
          <p className="text-sm">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
