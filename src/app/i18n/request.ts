import { getRequestConfig } from "next-intl/server";

import { TIME_ZONE } from "@/core/helpers/consts";

import { loadAllTranslations, getSafeLocale } from "./utils/loader";

export default getRequestConfig(async ({ requestLocale }) => {
  // The `[locale]` segment arrives via `requestLocale`. The `locale` param is
  // only populated when a caller passes one explicitly, as in
  // `getTranslations({locale: "en"})` — reading it here always yielded
  // undefined, silently pinning every request to the default locale.
  const finalLocale = getSafeLocale(await requestLocale);

  return {
    locale: finalLocale,
    messages: await loadAllTranslations(finalLocale),
    timeZone: TIME_ZONE,
    now: new Date(),
  };
});
