"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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

  const fallbackTitle = t("titleView");
  const fallbackMessage = t("messageView");

  title = title || fallbackTitle;
  message = message || fallbackMessage;

  return (
    <div className="flex w-full flex-col items-center justify-center py-8 text-center">
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="mb-4 flex justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <div className="absolute -inset-1 animate-pulse rounded-full bg-red-500/20 blur-md" />
          <AlertTriangle className="relative size-16 text-red-500" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md space-y-2 px-4"
        initial={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>

        {showRetry && onRetry && (
          <motion.div
            animate={{ opacity: 1 }}
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              className="gap-2"
              size="sm"
              variant="outline"
              onClick={onRetry}
            >
              <RefreshCcw className="size-4" />
              <span>Thử lại</span>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
