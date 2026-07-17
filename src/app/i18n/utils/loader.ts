import { cache } from "react";
import type { Messages } from "next-intl";

import {
  defaultLocale,
  locales,
  type Locale,
} from "@/app/i18n/config/settings";

/** Namespaces hydrated into NextIntlClientProvider (client islands only). */
export const clientNamespaces = ["common", "auth", "error"] as const;

/** All translation namespaces available on the server. */
export const namespaces = [
  "common",
  "auth",
  "error",
  "landing",
  "pages",
  "dashboard",
] as const;

export type Namespace = (typeof namespaces)[number];

const loadNamespaces = async (
  locale: string,
  requested: readonly string[],
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

/**
 * Dedupes JSON loads within a single React request (layout + page + request.ts).
 */
export const loadAllTranslations = cache(
  (locale: string): Promise<Messages> => loadNamespaces(locale, namespaces),
);

/**
 * Loads only the namespaces needed for client providers (keeps hydration payload small).
 */
export const loadClientTranslations = cache(
  (locale: string): Promise<Messages> =>
    loadNamespaces(locale, clientNamespaces),
);

/**
 * Server only. Loads just the namespaces asked for.
 * Empty / omitted list → all namespaces (via cached loadAllTranslations).
 */
export const loadTranslations = (
  locale: string,
  requested?: string | string[],
): Promise<Messages> => {
  if (!requested || !requested.length) {
    return loadAllTranslations(locale);
  }

  const selected = Array.isArray(requested) ? requested : [requested];
  // Per-request dedupe by joining selected keys into a stable cache key via
  // a nested cached helper would be overkill; small admin loads stay cheap.
  return loadNamespaces(locale, selected);
};

export const getSafeLocale = (locale: string | undefined): Locale =>
  locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
