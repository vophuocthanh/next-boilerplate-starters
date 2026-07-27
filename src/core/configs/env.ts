const isProduction = process.env.NODE_ENV === "production";

const rawApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!rawApiUrl && !isProduction) {
  console.warn(
    "[env] API_URL / NEXT_PUBLIC_API_URL is not set. API proxy routes will fail. " +
      "Copy .env.example to .env.local.",
  );
}

export const API_URL = rawApiUrl ?? "";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (isProduction && !siteUrl) {
  throw new Error(
    "[env] NEXT_PUBLIC_SITE_URL is required in production. " +
      "Set it to your canonical domain, e.g. https://example.com",
  );
}
export const SITE_URL = siteUrl ?? "";
