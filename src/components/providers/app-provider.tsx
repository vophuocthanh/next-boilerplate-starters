"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { type FallbackProps } from "react-error-boundary";

import { AppError } from "@/components/providers/app-error-provider";
import { ErrorBoundary } from "@/components/providers/error-boundary";
import ProviderQuery from "@/components/providers/provider-query";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TIME_ZONE } from "@/core/helpers/consts";

type AppProviderProps = {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export function AppProvider({ children, locale, messages }: AppProviderProps) {
  const handleError = (error: Error) => {
    console.error("App provider caught an error:", error);
  };

  const renderErrorFallback = ({
    error,
    resetErrorBoundary,
  }: FallbackProps) => (
    <AppError
      error={error}
      message={`Đã xảy ra lỗi: ${error.message}\n\nVui lòng thử làm mới trang.`}
      reset={resetErrorBoundary}
      title="Lỗi ứng dụng"
    />
  );

  return (
    <ErrorBoundary fallback={renderErrorFallback} onError={handleError}>
      <ThemeProvider>
        {/* `now` is intentionally omitted: this is a client component, so
            `new Date()` would differ between the server render and hydration.
            next-intl already receives `now` from the server in request.ts. */}
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone={TIME_ZONE}
        >
          <ProviderQuery>{children}</ProviderQuery>
        </NextIntlClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
