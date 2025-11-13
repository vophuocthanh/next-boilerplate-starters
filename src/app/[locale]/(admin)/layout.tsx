import { ReactNode } from "react";
import { AdminLayout } from "@/components/layout/admin";
import { getTranslations } from "@/app/i18n/server";
import { DashboardTranslations } from "@/components/layout/admin/types";

interface AdminLayoutPageProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

const AdminLayoutPage = async ({ children, params }: AdminLayoutPageProps) => {
  const { locale } = await params;
  const translationsData = await getTranslations(locale, ["dashboard"]);
  const translations =
    translationsData.dashboard as unknown as DashboardTranslations;

  return (
    <AdminLayout translations={translations} locale={locale}>
      {children}
    </AdminLayout>
  );
};

export default AdminLayoutPage;
