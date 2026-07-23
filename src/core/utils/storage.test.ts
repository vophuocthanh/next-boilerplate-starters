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

  describe("auth session (cookies)", () => {
    const session = {
      user: { id: "u1", email: "a@b.com", name: "An", role: "admin" },
      accessToken: "access-abc",
      refreshToken: "refresh-xyz",
    };

    it("lưu và đọc access / refresh token + user từ cookie", () => {
      setAuthSession(session);

      expect(getAccessToken()).toBe("access-abc");
      expect(getRefreshToken()).toBe("refresh-xyz");
      expect(getUserFromStorage()).toEqual(session.user);
      expect(document.cookie).toContain("accessToken=");
      expect(document.cookie).toContain("refreshToken=");
    });

    it("trả về null khi chưa có session", () => {
      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
      expect(getUserFromStorage()).toBeNull();
    });

    it("trả về null khi user JSON không hợp lệ", () => {
      document.cookie = `user=${encodeURIComponent("not-json{")}; path=/`;
      expect(getUserFromStorage()).toBeNull();
    });

    it("xoá toàn bộ session cookie", () => {
      setAuthSession(session);
      clearAuthSession();

      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
      expect(getUserFromStorage()).toBeNull();
    });

    it("dọn localStorage legacy khi set session", () => {
      localStorage.setItem("accessToken", "legacy");
      localStorage.setItem("refreshToken", "legacy");
      setAuthSession(session);
      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });
  });

  describe("setLocaleCookie", () => {
    it("ghi cookie locale vào document.cookie", () => {
      setLocaleCookie("vi");
      expect(document.cookie).toContain("NEXT_LOCALE=vi");
    });
  });
});
