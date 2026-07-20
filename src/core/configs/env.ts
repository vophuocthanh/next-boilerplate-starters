const rawApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!rawApiUrl && process.env.NODE_ENV !== "production") {
  console.warn(
    "[env] API_URL / NEXT_PUBLIC_API_URL is not set. API proxy routes will fail. " +
      "Copy .env.example to .env.local.",
  );
}

export const API_URL = rawApiUrl ?? "";
