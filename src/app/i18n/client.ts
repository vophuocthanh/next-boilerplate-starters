import { createTranslator, useTranslations } from "next-intl";

export type ClientTranslatorOptions = {
  locale: string;
  messages: Record<string, unknown>;
  namespace?: string;
};

export const createClientTranslator = (options: ClientTranslatorOptions) => {
  const { locale, messages, namespace } = options;

  if (namespace && messages[namespace]) {
    return createTranslator({ locale, messages: messages[namespace] });
  }

  return createTranslator({ locale, messages });
};

export const useAppTranslations = (namespace?: string) => {
  return useTranslations(namespace);
};
