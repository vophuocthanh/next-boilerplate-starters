"use client";

import ErrorPageContent from "@/app/[locale]/_components/error-page-content";
import type { ErrorPageProps } from "@/model/interface/error.interface";

const LocalizedErrorPage = ({ error, reset }: ErrorPageProps) => {
  return <ErrorPageContent error={error} reset={reset} />;
};

export default LocalizedErrorPage;
