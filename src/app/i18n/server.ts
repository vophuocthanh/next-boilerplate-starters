import { createTranslator } from "next-intl";

import type { Messages } from "./config/types";
import { loadTranslations } from "./utils/loader";

export const getMessages = async (locale: string): Promise<Messages> => {
  return loadTranslations(locale);
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
