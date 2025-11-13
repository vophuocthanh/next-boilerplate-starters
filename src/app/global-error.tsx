"use client";

import { AppError } from "@/components/providers/app-error-provider";
import { useLocale, useTranslations } from "next-intl";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const errorMessage = error?.message || "Unknown error";
  const errorName = error?.name || "Error";
  const t = useTranslations("error");

  return (
    <html lang={locale}>
      <head>
        <title>{t("systemError", { errorName })}</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </head>
      <body className="bg-background text-foreground">
        <AppError
          error={error}
          message={t("message", { errorMessage })}
          reset={reset}
          retryLabel="Làm mới trang"
          title={t("systemError", { errorName })}
        />
      </body>
    </html>
  );
}
