/**
 * Upstream API base URL used by BFF route handlers (`/api/auth/*`, `/api/proxy/*`).
 * Prefer server-only `API_URL`; fall back to `NEXT_PUBLIC_API_URL` for older setups.
 * Client code should call same-origin `/api/proxy` — not this URL directly.
 */
const rawApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!rawApiUrl && process.env.NODE_ENV !== "production") {
  console.warn(
    "[env] API_URL / NEXT_PUBLIC_API_URL is not set. BFF proxy and auth " +
      "routes will fail. Copy .env.example to .env.local.",
  );
}

export const API_URL = rawApiUrl ?? "";
