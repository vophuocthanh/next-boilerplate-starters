import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getTranslations } from "@/app/i18n/server";
import { AdminLayout } from "@/components/layout/admin";
import type { DashboardTranslations } from "@/components/layout/admin/types";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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

  return <AdminLayout translations={translations}>{children}</AdminLayout>;
};

export default AdminLayoutPage;
