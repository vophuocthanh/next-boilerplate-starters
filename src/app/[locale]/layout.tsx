import type { PropsWithChildren } from "react";

import type { Locale } from "@/app/i18n/config/settings";
import { getMessages } from "@/app/i18n/server";
import { AppProvider } from "@/components/providers/app-provider";

interface LocaleLayoutProps extends PropsWithChildren {
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  return (
    <AppProvider locale={locale as Locale} messages={messages}>
      {children}
    </AppProvider>
  );
}
