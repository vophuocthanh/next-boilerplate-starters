export const TIME_ZONE = "Asia/Ho_Chi_Minh";

export const CONSTANTS_MOUSE_DOWN = "mousedown";
export const CONSTANTS_TOUCH_START = "touchstart";

export const COOKIE_LOCALE = "NEXT_LOCALE";
export const COOKIE_LOCALE_MAX_AGE = 60 * 60 * 24 * 365;
export const COOKIE_LOCALE_SAME_SITE = "Lax" as const;

/**
 * Auth cookie names (client-readable — API dùng Bearer header cross-origin,
 * nên JS cần đọc được token để gắn Authorization).
 */
export const COOKIE_ACCESS_TOKEN = "accessToken";
export const COOKIE_REFRESH_TOKEN = "refreshToken";
export const COOKIE_USER = "user";

/** @deprecated Alias — dùng COOKIE_* */
export const STORAGE_ACCESS_TOKEN = COOKIE_ACCESS_TOKEN;
export const STORAGE_REFRESH_TOKEN = COOKIE_REFRESH_TOKEN;
export const STORAGE_USER = COOKIE_USER;

/** Access token lifetime (15 minutes). */
export const COOKIE_ACCESS_TOKEN_MAX_AGE = 60 * 15;
/** Refresh token lifetime (7 days). */
export const COOKIE_REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
/** User profile lifetime (aligned with refresh). */
export const COOKIE_USER_MAX_AGE = COOKIE_REFRESH_TOKEN_MAX_AGE;

/** lowercase cho Next.js ResponseCookie; document.cookie chấp nhận cả hai. */
export const COOKIE_AUTH_SAME_SITE = "lax" as const;
export const COOKIE_AUTH_PATH = "/";
