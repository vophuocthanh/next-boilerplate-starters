import type { UserResponseType } from "@/model/interface/user.interface";

// Constants
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

// Event handling
export const LocalStorageEventTarget = new EventTarget();

// Generic localStorage utilities
export const setItemToLS = <T>(key: string, value: T): void => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Failed to set item to localStorage with key: ${key}`, error);
  }
};

export const getItemFromLS = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue || null;
    }

    // Try to parse as JSON, if it fails return as string
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
    return defaultValue || null;
  }
};

export const removeItemFromLS = (key: string): void => {
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
export const setAccessTokenToLS = (access_token: string): void => {
  setItemToLS(STORAGE_KEYS.ACCESS_TOKEN, access_token);
};

export const getAccessTokenFromLS = (): string => {
  return getItemFromLS<string>(STORAGE_KEYS.ACCESS_TOKEN, "") || "";
};

export const removeAccessTokenFromLS = (): void => {
  removeItemFromLS(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setRefreshTokenToLS = (refresh_token: string): void => {
  setItemToLS(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
};

export const getRefreshTokenFromLS = (): string => {
  return getItemFromLS<string>(STORAGE_KEYS.REFRESH_TOKEN, "") || "";
};

// User management
export const getUserFromLocalStorage = (): UserResponseType | null => {
  return getItemFromLS<UserResponseType>(STORAGE_KEYS.USER);
};

export const setUserToLS = (user: UserResponseType): void => {
  setItemToLS(STORAGE_KEYS.USER, user);
};

// Session management
export const clearLS = (): void => {
  removeItemFromLS(STORAGE_KEYS.ACCESS_TOKEN);
  removeItemFromLS(STORAGE_KEYS.REFRESH_TOKEN);
  removeItemFromLS(STORAGE_KEYS.USER);

  const clearLSEvent = new Event("clearLS");
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};
