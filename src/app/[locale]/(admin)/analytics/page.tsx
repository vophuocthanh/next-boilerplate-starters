import { getTranslations } from "@/app/i18n/server";
import { DashboardTranslations } from "@/components/layout/admin/types";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Clock,
} from "lucide-react";

interface AnalyticsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const AnalyticsPage = async ({ params }: AnalyticsPageProps) => {
  const { locale } = await params;
  const translationsData = await getTranslations(locale, ["dashboard"]);
  const t = translationsData.dashboard as unknown as DashboardTranslations;

  const analyticsData = [
    {
      title: "Page Views",
      value: "2,847,392",
      change: "+12.5%",
      trend: "up" as const,
      icon: Eye,
      color: "blue",
    },
    {
      title: "Unique Visitors",
      value: "1,234,567",
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      color: "green",
    },
    {
      title: "Bounce Rate",
      value: "34.2%",
      change: "-2.1%",
      trend: "down" as const,
      icon: MousePointer,
      color: "orange",
    },
    {
      title: "Avg. Session Duration",
      value: "4m 32s",
      change: "+15.3%",
      trend: "up" as const,
      icon: Clock,
      color: "purple",
    },
  ];

  const topPages = [
    { path: "/dashboard", views: "45,231", percentage: "18.2%" },
    { path: "/products", views: "32,847", percentage: "13.2%" },
    { path: "/users", views: "28,394", percentage: "11.4%" },
    { path: "/analytics", views: "19,582", percentage: "7.9%" },
    { path: "/settings", views: "15,673", percentage: "6.3%" },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
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
      orange: {
        bg: "bg-orange-50 dark:bg-orange-950/30",
        text: "text-orange-600 dark:text-orange-400",
        icon: "bg-orange-500",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-950/30",
        text: "text-purple-600 dark:text-purple-400",
        icon: "bg-purple-500",
      },
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          {t.menu.analytics}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Comprehensive analytics and insights for your application
        </p>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.map((stat) => {
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Traffic Overview
          </h2>
          <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-600">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Traffic chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Top Pages
          </h2>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {page.path}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {page.views} views
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {page.percentage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          User Behavior Analytics
        </h2>
        <div className="h-80 flex items-center justify-center text-slate-400 dark:text-slate-600">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Advanced Analytics Coming Soon
            </p>
            <p className="text-sm">
              Detailed user behavior, conversion funnels, and custom events
              tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
