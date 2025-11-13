import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/app/i18n/config/settings";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
