"use client";

import { AppError } from "@/components/providers/app-error-provider";

const isProduction = process.env.NODE_ENV === "production";

/**
 * `global-error` replaces the root layout, so it renders outside every provider
 * — including NextIntlClientProvider. Calling a next-intl hook here throws and
 * takes the error page down with the error it was meant to show. Strings stay
 * hardcoded on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorName = error?.name || "Error";
  const errorMessage = isProduction
    ? "An unexpected error occurred."
    : error?.message || "Unknown error";
  const title = `System error: ${isProduction ? "Unexpected Error" : errorName}`;

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </head>
      <body className="bg-background text-foreground">
        <AppError
          error={error}
          message={`Error details: ${errorMessage}\n\nPlease try refreshing the page or come back later.`}
          reset={reset}
          retryLabel="Refresh page"
          title={title}
        />
      </body>
    </html>
  );
}
