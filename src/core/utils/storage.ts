import {
  COOKIE_LOCALE,
  COOKIE_LOCALE_MAX_AGE,
  COOKIE_LOCALE_SAME_SITE,
} from "@/core/helpers/consts";
import type { UserResponseType } from "@/model/interface/user.interface";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

const isClient = typeof window !== "undefined";

// Generic localStorage utilities
export const setItemToLS = <T>(key: string, value: T): void => {
  if (!isClient) return;
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Failed to set item to localStorage with key: ${key}`, error);
  }
};

export const getItemFromLS = <T>(key: string, defaultValue?: T): T | null => {
  if (!isClient) return defaultValue ?? null;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue ?? null;
    }

    // Tokens are stored as raw strings, everything else as JSON.
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch (error) {
    console.error(
      `Failed to get item from localStorage with key: ${key}`,
      error,
    );
    return defaultValue ?? null;
  }
};

export const removeItemFromLS = (key: string): void => {
  if (!isClient) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(
      `Failed to remove item from localStorage with key: ${key}`,
      error,
    );
  }
};

// Token management
export const setAccessTokenToLS = (accessToken: string): void => {
  setItemToLS(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
};

export const getAccessTokenFromLS = (): string => {
  return getItemFromLS<string>(STORAGE_KEYS.ACCESS_TOKEN, "") || "";
};

export const setRefreshTokenToLS = (refreshToken: string): void => {
  setItemToLS(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const getRefreshTokenFromLS = (): string => {
  return getItemFromLS<string>(STORAGE_KEYS.REFRESH_TOKEN, "") || "";
};

// User management
export const getUserFromLS = (): UserResponseType | null => {
  return getItemFromLS<UserResponseType>(STORAGE_KEYS.USER);
};

export const setUserToLS = (user: UserResponseType): void => {
  setItemToLS(STORAGE_KEYS.USER, user);
};

// Cookie management
export const setLocaleCookie = (locale: string): void => {
  if (!isClient) return;
  document.cookie = `${COOKIE_LOCALE}=${locale}; path=/; max-age=${COOKIE_LOCALE_MAX_AGE}; SameSite=${COOKIE_LOCALE_SAME_SITE}`;
};

// Session management
export const clearLS = (): void => {
  removeItemFromLS(STORAGE_KEYS.ACCESS_TOKEN);
  removeItemFromLS(STORAGE_KEYS.REFRESH_TOKEN);
  removeItemFromLS(STORAGE_KEYS.USER);
};
