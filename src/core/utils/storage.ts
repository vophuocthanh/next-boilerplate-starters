import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_ACCESS_TOKEN_MAX_AGE,
  COOKIE_AUTH_PATH,
  COOKIE_AUTH_SAME_SITE,
  COOKIE_LOCALE,
  COOKIE_LOCALE_MAX_AGE,
  COOKIE_LOCALE_SAME_SITE,
  COOKIE_REFRESH_TOKEN,
  COOKIE_REFRESH_TOKEN_MAX_AGE,
  COOKIE_USER,
  COOKIE_USER_MAX_AGE,
} from "@/core/helpers/consts";
import type { AuthSession } from "@/core/types/auth";
import type { UserResponseType } from "@/model/interface/user.interface";

const isClient = typeof window !== "undefined";
const isSecure =
  isClient &&
  (window.location.protocol === "https:" ||
    process.env.NODE_ENV === "production");

/** Cho phép UI subscribe khi session đổi (cùng tab). */
const AUTH_CHANGE_EVENT = "auth-session-change";

function getCookieValue(name: string): string | null {
  if (!isClient) return null;

  const prefix = `${name}=`;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));

  if (!match) return null;

  try {
    return decodeURIComponent(match.slice(prefix.length));
  } catch {
    return match.slice(prefix.length);
  }
}

function setClientCookie(
  name: string,
  value: string,
  maxAge: number,
  sameSite: string = COOKIE_AUTH_SAME_SITE,
): void {
  if (!isClient) return;

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${COOKIE_AUTH_PATH}`,
    `max-age=${maxAge}`,
    `SameSite=${sameSite}`,
  ];

  if (isSecure) {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

function removeClientCookie(name: string): void {
  if (!isClient) return;
  document.cookie = `${name}=; path=${COOKIE_AUTH_PATH}; max-age=0; SameSite=${COOKIE_AUTH_SAME_SITE}`;
}

function normalizeCookieValue(value: string | null): string | null {
  if (!value || value === "undefined" || value === "null") return null;
  return value;
}

/**
 * Xoá token cũ trên localStorage (migration từ bản trước).
 * Chỉ chạy phía client khi set/clear session.
 */
function clearLegacyLocalStorage(): void {
  if (!isClient) return;
  try {
    localStorage.removeItem(COOKIE_ACCESS_TOKEN);
    localStorage.removeItem(COOKIE_REFRESH_TOKEN);
    localStorage.removeItem(COOKIE_USER);
    // keys cũ có thể trùng tên
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  } catch {
    // ignore
  }
}

function notifyAuthChange(): void {
  if (!isClient) return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/** Subscribe session changes (same tab + cookie/storage cross-tab). */
export function subscribeAuthChange(onStoreChange: () => void): () => void {
  if (!isClient) return () => {};

  const onCustom = () => onStoreChange();
  // storage event: tab khác; không cover cookie, nhưng custom event cover same-tab.
  const onStorage = () => onStoreChange();

  window.addEventListener(AUTH_CHANGE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

// ── Auth session (cookies) ───────────────────────────────────────────────────

export const getAccessToken = (): string | null =>
  normalizeCookieValue(getCookieValue(COOKIE_ACCESS_TOKEN));

export const getRefreshToken = (): string | null =>
  normalizeCookieValue(getCookieValue(COOKIE_REFRESH_TOKEN));

export const getUserFromStorage = (): UserResponseType | null => {
  const raw = getCookieValue(COOKIE_USER);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserResponseType;
  } catch {
    return null;
  }
};

/** Alias — user cũng lưu cookie. */
export const getUserFromCookie = getUserFromStorage;

export const setAuthSession = (session: AuthSession): void => {
  if (!session?.accessToken || !session?.refreshToken) {
    throw new Error(
      "Invalid auth session: missing accessToken or refreshToken",
    );
  }

  clearLegacyLocalStorage();

  setClientCookie(
    COOKIE_ACCESS_TOKEN,
    session.accessToken,
    COOKIE_ACCESS_TOKEN_MAX_AGE,
  );
  setClientCookie(
    COOKIE_REFRESH_TOKEN,
    session.refreshToken,
    COOKIE_REFRESH_TOKEN_MAX_AGE,
  );
  setClientCookie(
    COOKIE_USER,
    JSON.stringify(session.user ?? null),
    COOKIE_USER_MAX_AGE,
  );
  notifyAuthChange();
};

export const setAccessToken = (token: string): void => {
  setClientCookie(COOKIE_ACCESS_TOKEN, token, COOKIE_ACCESS_TOKEN_MAX_AGE);
  notifyAuthChange();
};

export const setRefreshToken = (token: string): void => {
  setClientCookie(COOKIE_REFRESH_TOKEN, token, COOKIE_REFRESH_TOKEN_MAX_AGE);
  notifyAuthChange();
};

export const clearAuthSession = (): void => {
  removeClientCookie(COOKIE_ACCESS_TOKEN);
  removeClientCookie(COOKIE_REFRESH_TOKEN);
  removeClientCookie(COOKIE_USER);
  clearLegacyLocalStorage();
  notifyAuthChange();
};

/** @deprecated Prefer `clearAuthSession`. */
export const clearUserCookie = clearAuthSession;

// ── Locale cookie ────────────────────────────────────────────────────────────

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
