"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { AppError } from "@/components/providers/app-error-provider";
import { logErrorDetails, processError } from "@/core/helpers/error.utils";
import type { ErrorPageProps } from "@/model/interface/error.interface";

const isProduction = process.env.NODE_ENV === "production";

const ErrorPageContent = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations("error");

  const { errorName, errorMessage } = processError(error);

  useEffect(() => {
    logErrorDetails(error);
  }, [error]);

  // In production, never expose raw error messages to the user.
  const displayMessage = isProduction
    ? t("genericMessage")
    : t("message", { errorMessage });

  const displayTitle = isProduction
    ? t("genericTitle")
    : t("title", { errorName });

  return (
    <AppError
      error={error}
      message={displayMessage}
      reset={reset}
      retryLabel={t("retry")}
      title={displayTitle}
    />
  );
};

export default ErrorPageContent;
