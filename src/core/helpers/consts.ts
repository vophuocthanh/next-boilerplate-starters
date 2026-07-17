export const TIME_ZONE = "Asia/Ho_Chi_Minh";

export const CONSTANTS_MOUSE_DOWN = "mousedown";
export const CONSTANTS_TOUCH_START = "touchstart";

export const COOKIE_LOCALE = "NEXT_LOCALE";
export const COOKIE_LOCALE_MAX_AGE = 60 * 60 * 24 * 365;
export const COOKIE_LOCALE_SAME_SITE = "Lax" as const;

/** Auth cookie names — tokens are httpOnly and only readable on the server. */
export const COOKIE_ACCESS_TOKEN = "access_token";
export const COOKIE_REFRESH_TOKEN = "refresh_token";
export const COOKIE_USER = "user";

/** Access token lifetime (15 minutes). */
export const COOKIE_ACCESS_TOKEN_MAX_AGE = 60 * 15;
/** Refresh token lifetime (7 days). */
export const COOKIE_REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
/** User profile cookie lifetime (aligned with refresh). */
export const COOKIE_USER_MAX_AGE = COOKIE_REFRESH_TOKEN_MAX_AGE;

export const COOKIE_AUTH_SAME_SITE = "lax" as const;
export const COOKIE_AUTH_PATH = "/";
