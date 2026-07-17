import { createTranslator } from "next-intl";

import type { Messages } from "./config/types";
import { loadClientTranslations, loadTranslations } from "./utils/loader";

/** Full message tree (server-side). Deduped per request via `cache()`. */
export const getMessages = async (locale: string): Promise<Messages> => {
  return loadTranslations(locale);
};

/**
 * Slim message tree for NextIntlClientProvider.
 * Only namespaces used by client islands (`common`, `auth`, `error`).
 */
export const getClientMessages = async (locale: string): Promise<Messages> => {
  return loadClientTranslations(locale);
};

export const getTranslations = async (
  locale: string,
  namespace: string | string[] = [],
): Promise<Messages> => {
  return loadTranslations(locale, namespace);
};

export const createTranslations = async (
  locale: string,
  namespace?: string | string[],
) => {
  const messages = await getTranslations(locale, namespace || []);
  return createTranslator({ locale, messages });
};
