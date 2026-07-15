import {
  defaultLocale,
  locales,
  type Locale,
} from "@/app/i18n/config/settings";
import { Messages } from "next-intl";

export const namespaces = [
  "common",
  "auth",
  "error",
  "landing",
  "pages",
  "dashboard",
];

const loadNamespaces = async (
  locale: string,
  requested: string[],
): Promise<Messages> => {
  try {
    const entries = await Promise.all(
      requested.map(
        async (namespace) =>
          [
            namespace,
            (await import(`../dictionaries/${locale}/${namespace}.json`))
              .default,
          ] as const,
      ),
    );

    return Object.fromEntries(entries);
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    return {};
  }
};

/** Server only. Loads every namespace. */
export const loadAllTranslations = (locale: string): Promise<Messages> =>
  loadNamespaces(locale, namespaces);

/**
 * Server only. Loads just the namespaces asked for — importing all six and
 * then discarding five buys nothing.
 */
export const loadTranslations = (
  locale: string,
  requested?: string | string[],
): Promise<Messages> => {
  if (!requested || !requested.length) {
    return loadAllTranslations(locale);
  }

  const selected = Array.isArray(requested) ? requested : [requested];
  return loadNamespaces(locale, selected);
};

export const getSafeLocale = (locale: string | undefined): Locale =>
  locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
