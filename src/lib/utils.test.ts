import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("nối nhiều class name thành một chuỗi", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("bỏ qua các giá trị falsy (false, null, undefined)", () => {
    expect(cn("text-sm", false, null, undefined, "font-bold")).toBe(
      "text-sm font-bold",
    );
  });

  it("áp dụng class có điều kiện qua object", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("merge các class Tailwind xung đột, giữ class cuối cùng", () => {
    // twMerge: px-4 ghi đè px-2
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("làm phẳng mảng class name", () => {
    expect(cn(["px-2", "py-1"], "font-bold")).toBe("px-2 py-1 font-bold");
  });

  it("trả về chuỗi rỗng khi không có input", () => {
    expect(cn()).toBe("");
  });
});
