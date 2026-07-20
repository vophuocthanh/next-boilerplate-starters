import {
  COOKIE_LOCALE,
  COOKIE_LOCALE_MAX_AGE,
  COOKIE_LOCALE_SAME_SITE,
  STORAGE_ACCESS_TOKEN,
  STORAGE_REFRESH_TOKEN,
  STORAGE_USER,
} from "@/core/helpers/consts";
import type { AuthSession } from "@/core/types/auth";
import type { UserResponseType } from "@/model/interface/user.interface";

const isClient = typeof window !== "undefined";

function getCookieValue(name: string): string | null {
  if (!isClient) return null;

  const prefix = `${name}=`;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));

  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length));
}

function setClientCookie(
  name: string,
  value: string,
  maxAge: number,
  sameSite: string = "Lax",
): void {
  if (!isClient) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=${sameSite}`;
}

function readStorage(key: string): string | null {
  if (!isClient) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // private mode / quota
  }
}

function removeStorage(key: string): void {
  if (!isClient) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ── Auth session (client-side tokens — not httpOnly) ────────────────────────

export const getAccessToken = (): string | null =>
  readStorage(STORAGE_ACCESS_TOKEN);

export const getRefreshToken = (): string | null =>
  readStorage(STORAGE_REFRESH_TOKEN);

export const getUserFromStorage = (): UserResponseType | null => {
  const raw = readStorage(STORAGE_USER);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserResponseType;
  } catch {
    return null;
  }
};

/** @deprecated Prefer `getUserFromStorage` — kept for call sites that still say "cookie". */
export const getUserFromCookie = getUserFromStorage;

export const setAuthSession = (session: AuthSession): void => {
  writeStorage(STORAGE_ACCESS_TOKEN, session.accessToken);
  writeStorage(STORAGE_REFRESH_TOKEN, session.refreshToken);
  writeStorage(STORAGE_USER, JSON.stringify(session.user));
};

export const setAccessToken = (token: string): void => {
  writeStorage(STORAGE_ACCESS_TOKEN, token);
};

export const setRefreshToken = (token: string): void => {
  writeStorage(STORAGE_REFRESH_TOKEN, token);
};

export const clearAuthSession = (): void => {
  removeStorage(STORAGE_ACCESS_TOKEN);
  removeStorage(STORAGE_REFRESH_TOKEN);
  removeStorage(STORAGE_USER);
};

/** @deprecated Prefer `clearAuthSession`. */
export const clearUserCookie = clearAuthSession;

// ── Locale cookie (still a real cookie — read by next-intl / middleware) ─────

export const setLocaleCookie = (locale: string): void => {
  setClientCookie(
    COOKIE_LOCALE,
    locale,
    COOKIE_LOCALE_MAX_AGE,
    COOKIE_LOCALE_SAME_SITE,
  );
};

export const getLocaleCookie = (): string | null =>
  getCookieValue(COOKIE_LOCALE);
