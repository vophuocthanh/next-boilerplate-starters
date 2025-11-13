import { defaultLocale, locales } from "@/app/i18n/config/settings";
import { Messages } from "next-intl";

// list of namespaces
export const namespaces = [
  "common",
  "auth",
  "error",
  "landing",
  "pages",
  "dashboard",
];

// const server only request all translations
export const loadAllTranslations = async (
  locale: string,
): Promise<Messages> => {
  try {
    const translations: Messages = {};

    for (const namespace of namespaces) {
      translations[namespace] = await import(
        `../dictionaries/${locale}/${namespace}.json`
      ).then((module) => module.default);
    }

    return translations;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    return {};
  }
};

// const server only specified namespaces
export const loadTranslations = async (
  locale: string,
  namespaces?: string | string[],
): Promise<Messages> => {
  const allTranslations = await loadAllTranslations(locale);

  if (!namespaces || !namespaces.length) {
    return allTranslations;
  }

  const selectedNamespaces = Array.isArray(namespaces)
    ? namespaces
    : [namespaces];
  const selectedTranslations: Messages = {};

  selectedNamespaces.forEach((namespace) => {
    if (allTranslations[namespace]) {
      selectedTranslations[namespace] = allTranslations[namespace];
    }
  });

  return selectedTranslations;
};

// const server only safe locale
export const getSafeLocale = (locale: string | undefined): string => {
  const safeLocale = typeof locale === "string" ? locale : defaultLocale;
  return locales.includes(safeLocale as (typeof locales)[number])
    ? safeLocale
    : defaultLocale;
};
