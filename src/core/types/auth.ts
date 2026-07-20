import type { UserResponseType } from "@/model/interface/user.interface";

/**
 * Platform-level auth token shapes.
 * Kept in `core` so http client / storage never import from `features/*`.
 */

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/** Full session persisted after login (tokens + profile). */
export type AuthSession = AuthTokens & {
  user: UserResponseType;
};

/** Refresh endpoint may rotate both tokens or only the access token. */
export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken?: string;
};
