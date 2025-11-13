import { getRequestConfig } from "next-intl/server";

import { TIME_ZONE } from "@/core/helpers/consts";

import type { Messages } from "./config/types";
import { loadAllTranslations, getSafeLocale } from "./utils/loader";

export default getRequestConfig(async ({ locale }) => {
  const finalLocale = getSafeLocale(locale);

  try {
    const messages = await loadAllTranslations(finalLocale);

    return {
      locale: finalLocale,
      messages,
      timeZone: TIME_ZONE,
      now: new Date(),
    };
  } catch (error) {
    console.error(`Could not load messages for locale: ${finalLocale}`, error);
    return {
      locale: finalLocale,
      messages: {} as Messages,
      timeZone: TIME_ZONE,
      now: new Date(),
    };
  }
});
