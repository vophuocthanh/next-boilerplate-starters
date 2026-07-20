import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { locales, type Locale } from "@/app/i18n/config/settings";
import { SignUpForm } from "@/features/auth";

interface SignUpPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: SignUpPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("signUp"),
    description: t("signUpDescription"),
  };
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <SignUpForm />;
}
