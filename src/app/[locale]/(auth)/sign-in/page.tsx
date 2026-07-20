import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { locales, type Locale } from "@/app/i18n/config/settings";
import { SignInForm } from "@/features/auth";

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: SignInPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("signIn"),
    description: t("signInDescription"),
  };
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <SignInForm />;
}
