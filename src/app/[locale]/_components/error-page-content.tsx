"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { AppError } from "@/components/providers/app-error-provider";
import { logErrorDetails, processError } from "@/core/helpers/error.utils";
import type { ErrorPageProps } from "@/model/interface/error.interface";

const ErrorPageContent = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations("error");

  const { errorName, errorMessage } = processError(error);

  useEffect(() => {
    logErrorDetails(error);
  }, [error]);

  return (
    <AppError
      error={error}
      message={t("message", { errorMessage })}
      reset={reset}
      retryLabel={t("retry")}
      title={t("title", { errorName })}
    />
  );
};

export default ErrorPageContent;
