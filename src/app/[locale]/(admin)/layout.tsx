import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getTranslations } from "@/app/i18n/server";
import { AdminLayout } from "@/components/layout/admin";
import type { DashboardTranslations } from "@/components/layout/admin/types";
import ProviderQuery from "@/components/providers/provider-query";

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

  return (
    <ProviderQuery>
      <AdminLayout translations={translations}>{children}</AdminLayout>
    </ProviderQuery>
  );
};

export default AdminLayoutPage;
