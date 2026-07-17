import type { PropsWithChildren } from "react";

import type { Locale } from "@/app/i18n/config/settings";
import { getClientMessages } from "@/app/i18n/server";
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
  // Only hydrate namespaces that client islands actually read
  // (`common` / `auth` / `error`). Landing/dashboard copy stays server-side.
  const messages = await getClientMessages(locale as Locale);

  return (
    <AppProvider locale={locale as Locale} messages={messages}>
      {children}
    </AppProvider>
  );
}
