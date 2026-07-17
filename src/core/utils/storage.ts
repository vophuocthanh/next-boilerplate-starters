import {
  COOKIE_LOCALE,
  COOKIE_LOCALE_MAX_AGE,
  COOKIE_LOCALE_SAME_SITE,
  COOKIE_USER,
} from "@/core/helpers/consts";
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

function removeClientCookie(name: string): void {
  if (!isClient) return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

/**
 * Read the user profile cookie (not httpOnly — tokens live only in httpOnly cookies).
 * Access/refresh tokens are never readable from client JS.
 */
export const getUserFromCookie = (): UserResponseType | null => {
  const raw = getCookieValue(COOKIE_USER);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserResponseType;
  } catch {
    return null;
  }
};

/** Clear the non-httpOnly user cookie on the client. Tokens must be cleared via /api/auth/logout. */
export const clearUserCookie = (): void => {
  removeClientCookie(COOKIE_USER);
};

export const setLocaleCookie = (locale: string): void => {
  setClientCookie(
    COOKIE_LOCALE,
    locale,
    COOKIE_LOCALE_MAX_AGE,
    COOKIE_LOCALE_SAME_SITE,
  );
};
