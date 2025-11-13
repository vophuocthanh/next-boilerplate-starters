export const defaultLocale = "vi";
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export const getLocaleFromPathname = (pathname: string): Locale | undefined => {
  const segments = pathname.split("/");
  const localeSegment = segments[1];
  if (locales.includes(localeSegment as Locale)) {
    return localeSegment as Locale;
  }
  return undefined;
};

export const removeLocaleFromPathname = (pathname: string): string => {
  const segments = pathname.split("/");
  const localeSegment = segments[1];

  if (locales.includes(localeSegment as Locale)) {
    return "/" + segments.slice(2).join("/");
  }

  return pathname;
};

export const getI18nPath = (locale: Locale | string, path: string): string => {
  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path}`;
};
