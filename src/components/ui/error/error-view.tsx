"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type ErrorViewProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
};

export const ErrorView = ({
  title,
  message,
  onRetry,
  showRetry = true,
}: ErrorViewProps) => {
  const t = useTranslations("error");

  const resolvedTitle = title || t("titleView");
  const resolvedMessage = message || t("messageView");

  return (
    <div className="flex w-full flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 flex justify-center animate-fade-in-up">
        <div className="relative">
          <div className="absolute -inset-1 animate-pulse rounded-full bg-red-500/20 blur-md" />
          <AlertTriangle className="relative size-16 text-red-500" />
        </div>
      </div>

      <div className="max-w-md space-y-2 px-4 animate-fade-in-up animation-delay-100">
        <h3 className="text-xl font-semibold text-foreground">
          {resolvedTitle}
        </h3>
        <p className="text-sm text-muted-foreground">{resolvedMessage}</p>

        {showRetry && onRetry && (
          <div className="mt-4 flex justify-center animate-fade-in animation-delay-200">
            <Button
              className="gap-2"
              size="sm"
              variant="outline"
              onClick={onRetry}
            >
              <RefreshCcw className="size-4" />
              <span>{t("retry")}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
