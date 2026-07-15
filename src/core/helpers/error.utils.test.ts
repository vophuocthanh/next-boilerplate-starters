import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logErrorDetails, processError } from "@/core/helpers/error.utils";

describe("processError", () => {
  it("trích xuất name, message và digest từ error đầy đủ", () => {
    const error = Object.assign(new Error("Something broke"), {
      name: "TypeError",
      digest: "abc123",
    });

    expect(processError(error)).toEqual({
      errorName: "TypeError",
      errorMessage: "Something broke",
      errorDigest: "abc123",
    });
  });

  it("dùng giá trị mặc định khi error thiếu digest", () => {
    const error = new Error("No digest here");

    expect(processError(error)).toEqual({
      errorName: "Error",
      errorMessage: "No digest here",
      errorDigest: "",
    });
  });

  it("fallback về 'Error' và 'Unknown error' khi các field rỗng", () => {
    // Ép name/message rỗng để kiểm tra nhánh fallback
    const error = { name: "", message: "" } as Error & { digest?: string };

    expect(processError(error)).toEqual({
      errorName: "Error",
      errorMessage: "Unknown error",
      errorDigest: "",
    });
  });
});

describe("logErrorDetails", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("gọi console.error với thông tin chi tiết của error", () => {
    const error = Object.assign(new Error("boom"), {
      name: "RangeError",
      digest: "digest-1",
      stack: "stack-trace",
    });

    logErrorDetails(error);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith("Page error details:", {
      name: "RangeError",
      message: "boom",
      digest: "digest-1",
      stack: "stack-trace",
    });
  });
});
