import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_ACCESS_TOKEN_MAX_AGE,
  COOKIE_AUTH_PATH,
  COOKIE_AUTH_SAME_SITE,
  COOKIE_REFRESH_TOKEN,
  COOKIE_REFRESH_TOKEN_MAX_AGE,
  COOKIE_USER,
  COOKIE_USER_MAX_AGE,
} from "@/core/helpers/consts";
import { toSafeUser } from "@/core/helpers/safe-user";
import type { SafeUserCookie } from "@/core/helpers/safe-user";
import type { UserResponseType } from "@/model/interface/user.interface";

const isProduction = process.env.NODE_ENV === "production";

type CookieWritable = Pick<NextResponse, "cookies">;

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: typeof COOKIE_AUTH_SAME_SITE;
  path: string;
  maxAge: number;
};

function baseCookieOptions(maxAge: number, httpOnly: boolean): CookieOptions {
  return {
    httpOnly,
    secure: isProduction,
    sameSite: COOKIE_AUTH_SAME_SITE,
    path: COOKIE_AUTH_PATH,
    maxAge,
  };
}

export function setAuthCookiesOnResponse(
  response: CookieWritable,
  tokens: { accessToken: string; refreshToken: string },
  user?: UserResponseType,
): void {
  response.cookies.set(
    COOKIE_ACCESS_TOKEN,
    tokens.accessToken,
    baseCookieOptions(COOKIE_ACCESS_TOKEN_MAX_AGE, false),
  );
  response.cookies.set(
    COOKIE_REFRESH_TOKEN,
    tokens.refreshToken,
    baseCookieOptions(COOKIE_REFRESH_TOKEN_MAX_AGE, false),
  );

  if (user) {
    response.cookies.set(
      COOKIE_USER,
      JSON.stringify(toSafeUser(user)),
      baseCookieOptions(COOKIE_USER_MAX_AGE, false),
    );
  }
}

export function clearAuthCookiesOnResponse(response: CookieWritable): void {
  const expire = baseCookieOptions(0, false);
  response.cookies.set(COOKIE_ACCESS_TOKEN, "", expire);
  response.cookies.set(COOKIE_REFRESH_TOKEN, "", expire);
  response.cookies.set(COOKIE_USER, "", expire);
}

export async function getAccessTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_ACCESS_TOKEN)?.value;
}

export async function getRefreshTokenFromCookies(): Promise<
  string | undefined
> {
  const store = await cookies();
  return store.get(COOKIE_REFRESH_TOKEN)?.value;
}

export async function getUserFromCookies(): Promise<SafeUserCookie | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_USER)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SafeUserCookie;
  } catch {
    return null;
  }
}
