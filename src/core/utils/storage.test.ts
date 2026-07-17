import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  clearUserCookie,
  getUserFromCookie,
  setLocaleCookie,
} from "@/core/utils/storage";

function clearAllCookies() {
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; path=/; max-age=0`;
  });
}

describe("storage utils (cookies)", () => {
  beforeEach(() => {
    clearAllCookies();
  });

  afterEach(() => {
    clearAllCookies();
  });

  describe("getUserFromCookie / clearUserCookie", () => {
    it("đọc user object từ cookie (không httpOnly)", () => {
      const user = { id: "u1", email: "a@b.com", name: "An", role: "admin" };
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/`;

      expect(getUserFromCookie()).toEqual(user);
    });

    it("trả về null khi chưa có cookie user", () => {
      expect(getUserFromCookie()).toBeNull();
    });

    it("trả về null khi cookie user không phải JSON hợp lệ", () => {
      document.cookie = "user=not-json{; path=/";
      expect(getUserFromCookie()).toBeNull();
    });

    it("xoá cookie user phía client", () => {
      document.cookie = `user=${encodeURIComponent(JSON.stringify({ id: "1" }))}; path=/`;
      clearUserCookie();
      expect(getUserFromCookie()).toBeNull();
    });
  });

  describe("setLocaleCookie", () => {
    it("ghi cookie locale vào document.cookie", () => {
      setLocaleCookie("vi");
      expect(document.cookie).toContain("NEXT_LOCALE=vi");
    });
  });
});
