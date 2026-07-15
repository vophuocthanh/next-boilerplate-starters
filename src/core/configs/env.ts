const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!rawApiUrl && process.env.NODE_ENV !== "production") {
  console.warn(
    "[env] NEXT_PUBLIC_API_URL is not set. API requests will resolve against " +
      "the app's own origin and fail. Copy .env.example to .env.local.",
  );
}

export const API_URL = rawApiUrl ?? "";
