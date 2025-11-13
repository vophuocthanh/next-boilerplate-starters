"use client";

import ErrorPageContent from "@/app/[locale]/_components/error-page-content";
import { defaultLocale } from "@/app/i18n/config/settings";
import type { ErrorPageProps } from "@/model/interface/error.interface";

const LocalizedErrorPage = ({ error, reset, params }: ErrorPageProps) => {
  const locale = params?.locale || defaultLocale;

  return <ErrorPageContent error={error} locale={locale} reset={reset} />;
};

export default LocalizedErrorPage;
