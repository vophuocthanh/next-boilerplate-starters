import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "@/app/i18n/config/settings";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});
