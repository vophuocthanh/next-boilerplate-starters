"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";

/** Maps Zod message keys to `auth.validation.*` dictionary strings. */
export function useAuthValidationMessage() {
  const t = useTranslations("auth.validation");

  return useCallback(
    (message?: string) => {
      if (!message) {
        return undefined;
      }

      if (t.has(message)) {
        return t(message);
      }

      return message;
    },
    [t],
  );
}
