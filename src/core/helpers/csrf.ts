const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "X-CSRF-Token";

/** Generate a cryptographically random CSRF token. */
export function generateCsrfToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (unlikely in modern browsers)
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${CSRF_COOKIE_NAME}=`;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));

  if (!match) return null;

  try {
    return decodeURIComponent(match.slice(prefix.length));
  } catch {
    return null;
  }
}

export function setCsrfTokenCookie(token: string): void {
  if (typeof document === "undefined") return;

  const isProduction = process.env.NODE_ENV === "production";
  const parts = [
    `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "path=/",
    "SameSite=Strict",
  ];

  if (isProduction || window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

export function getCsrfHeaders(): Record<string, string> {
  const token = getCsrfTokenFromCookie();
  if (!token) return {};
  return { [CSRF_HEADER_NAME]: token };
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
