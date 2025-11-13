"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { AppError } from "@/components/providers/app-error-provider";
import {
  getFallbackErrorMessages,
  logErrorDetails,
  processError,
} from "@/core/helpers/error.utils";
import type { ErrorContentProps } from "@/model/interface/error.interface";

const ErrorPageContent = ({ error, reset }: ErrorContentProps) => {
  const t = useTranslations("error");

  const { errorName, errorMessage } = processError(error);

  const fallbackMessages = getFallbackErrorMessages(errorName, errorMessage);

  let title = fallbackMessages.title;
  let message = fallbackMessages.message;
  let retryLabel = fallbackMessages.retryLabel;

  try {
    title = t("title", { errorName });
    message = t("message", { errorMessage });
    retryLabel = t("retry");
  } catch (translationError) {
    console.error("Translation error:", translationError);
  }

  useEffect(() => {
    logErrorDetails(error);
  }, [error]);

  return (
    <AppError
      error={error}
      message={message}
      reset={reset}
      retryLabel={retryLabel}
      title={title}
    />
  );
};

export default ErrorPageContent;
