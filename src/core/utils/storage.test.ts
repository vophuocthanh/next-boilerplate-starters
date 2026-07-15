import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearLS,
  getAccessTokenFromLS,
  getItemFromLS,
  getRefreshTokenFromLS,
  getUserFromLS,
  removeItemFromLS,
  setAccessTokenToLS,
  setItemToLS,
  setLocaleCookie,
  setRefreshTokenToLS,
  setUserToLS,
} from "@/core/utils/storage";

describe("storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    // Xoá mọi cookie đang có trước mỗi test
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name) document.cookie = `${name}=; path=/; max-age=0`;
    });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("setItemToLS / getItemFromLS", () => {
    it("lưu và đọc lại một chuỗi nguyên bản (không JSON hoá)", () => {
      setItemToLS("token", "raw-string");
      expect(localStorage.getItem("token")).toBe("raw-string");
      expect(getItemFromLS<string>("token")).toBe("raw-string");
    });

    it("JSON hoá object khi lưu và parse lại khi đọc", () => {
      const value = { id: 1, name: "An" };
      setItemToLS("obj", value);
      expect(localStorage.getItem("obj")).toBe(JSON.stringify(value));
      expect(getItemFromLS<typeof value>("obj")).toEqual(value);
    });

    it("trả về defaultValue khi key không tồn tại", () => {
      expect(getItemFromLS("missing", "fallback")).toBe("fallback");
    });

    it("trả về null khi key không tồn tại và không có defaultValue", () => {
      expect(getItemFromLS("missing")).toBeNull();
    });

    it("trả về nguyên chuỗi khi giá trị không phải JSON hợp lệ", () => {
      localStorage.setItem("weird", "not-json{");
      expect(getItemFromLS<string>("weird")).toBe("not-json{");
    });

    it("nuốt lỗi và log khi localStorage.setItem ném lỗi", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceeded");
      });

      expect(() => setItemToLS("k", "v")).not.toThrow();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("removeItemFromLS", () => {
    it("xoá key khỏi localStorage", () => {
      setItemToLS("temp", "value");
      removeItemFromLS("temp");
      expect(localStorage.getItem("temp")).toBeNull();
    });
  });

  describe("token & user helpers", () => {
    it("lưu / đọc access token", () => {
      setAccessTokenToLS("access-123");
      expect(getAccessTokenFromLS()).toBe("access-123");
    });

    it("access token mặc định là chuỗi rỗng khi chưa set", () => {
      expect(getAccessTokenFromLS()).toBe("");
    });

    it("lưu / đọc refresh token", () => {
      setRefreshTokenToLS("refresh-456");
      expect(getRefreshTokenFromLS()).toBe("refresh-456");
    });

    it("lưu / đọc user object", () => {
      const user = { id: "u1", email: "a@b.com" } as never;
      setUserToLS(user);
      expect(getUserFromLS()).toEqual(user);
    });

    it("user mặc định là null khi chưa set", () => {
      expect(getUserFromLS()).toBeNull();
    });
  });

  describe("clearLS", () => {
    it("xoá access token, refresh token và user", () => {
      setAccessTokenToLS("a");
      setRefreshTokenToLS("r");
      setUserToLS({ id: "u" } as never);

      clearLS();

      expect(getAccessTokenFromLS()).toBe("");
      expect(getRefreshTokenFromLS()).toBe("");
      expect(getUserFromLS()).toBeNull();
    });
  });

  describe("setLocaleCookie", () => {
    it("ghi cookie locale vào document.cookie", () => {
      setLocaleCookie("vi");
      expect(document.cookie).toContain("NEXT_LOCALE=vi");
    });
  });
});
