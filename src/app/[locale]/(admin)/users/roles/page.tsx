import { getTranslations } from "@/app/i18n/server";
import { DashboardTranslations } from "@/components/layout/admin/types";
import { Shield, Users, Plus, Edit, Trash2, Settings } from "lucide-react";

interface UserRolesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const UserRolesPage = async ({ params }: UserRolesPageProps) => {
  const { locale } = await params;
  const translationsData = await getTranslations(locale, ["dashboard"]);
  const t = translationsData.dashboard as unknown as DashboardTranslations;

  const roles = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      userCount: 2,
      permissions: ["All Permissions"],
      color: "red",
    },
    {
      id: 2,
      name: "Admin",
      description: "Administrative access with most permissions",
      userCount: 5,
      permissions: [
        "User Management",
        "Content Management",
        "Analytics",
        "Settings",
      ],
      color: "purple",
    },
    {
      id: 3,
      name: "Editor",
      description: "Can create and edit content",
      userCount: 12,
      permissions: ["Content Management", "Analytics View"],
      color: "blue",
    },
    {
      id: 4,
      name: "Moderator",
      description: "Can moderate content and users",
      userCount: 8,
      permissions: ["Content Moderation", "User Moderation"],
      color: "green",
    },
    {
      id: 5,
      name: "User",
      description: "Basic user access",
      userCount: 234,
      permissions: ["Profile Management"],
      color: "slate",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> =
      {
        red: {
          bg: "bg-red-50 dark:bg-red-950/30",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-800",
        },
        purple: {
          bg: "bg-purple-50 dark:bg-purple-950/30",
          text: "text-purple-700 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-800",
        },
        blue: {
          bg: "bg-blue-50 dark:bg-blue-950/30",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800",
        },
        green: {
          bg: "bg-green-50 dark:bg-green-950/30",
          text: "text-green-700 dark:text-green-400",
          border: "border-green-200 dark:border-green-800",
        },
        slate: {
          bg: "bg-slate-50 dark:bg-slate-950/30",
          text: "text-slate-700 dark:text-slate-400",
          border: "border-slate-200 dark:border-slate-800",
        },
      };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            {t.menu.userRoles}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage user roles and their permissions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Roles
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {roles.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Active Roles
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {roles.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const colors = getColorClasses(role.color);
          return (
            <div
              key={role.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border-2 ${colors.border} p-6 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${colors.bg} rounded-lg`}>
                  <Shield className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {role.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {role.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {role.userCount} users
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Permissions:
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                Manage Role
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserRolesPage;
