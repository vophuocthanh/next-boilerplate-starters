import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getUserFromStorage,
  setAuthSession,
  setLocaleCookie,
} from "@/core/utils/storage";

function clearAllCookies() {
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; path=/; max-age=0`;
  });
}

describe("storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    clearAllCookies();
  });

  afterEach(() => {
    localStorage.clear();
    clearAllCookies();
  });

  describe("auth session (localStorage)", () => {
    const session = {
      user: { id: "u1", email: "a@b.com", name: "An", role: "admin" },
      accessToken: "access-abc",
      refreshToken: "refresh-xyz",
    };

    it("lưu và đọc access / refresh token + user", () => {
      setAuthSession(session);

      expect(getAccessToken()).toBe("access-abc");
      expect(getRefreshToken()).toBe("refresh-xyz");
      expect(getUserFromStorage()).toEqual(session.user);
    });

    it("trả về null khi chưa có session", () => {
      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
      expect(getUserFromStorage()).toBeNull();
    });

    it("trả về null khi user JSON không hợp lệ", () => {
      localStorage.setItem("user", "not-json{");
      expect(getUserFromStorage()).toBeNull();
    });

    it("xoá toàn bộ session phía client", () => {
      setAuthSession(session);
      clearAuthSession();

      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
      expect(getUserFromStorage()).toBeNull();
    });
  });

  describe("setLocaleCookie", () => {
    it("ghi cookie locale vào document.cookie", () => {
      setLocaleCookie("vi");
      expect(document.cookie).toContain("NEXT_LOCALE=vi");
    });
  });
});
