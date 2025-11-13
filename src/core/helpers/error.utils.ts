import type { ProcessedError } from "@/model/interface/error.interface";

/**
 * Processes error object and extracts relevant information
 */
export const processError = (
  error: Error & { digest?: string },
): ProcessedError => {
  const errorName = error?.name || "Error";
  const errorMessage = error?.message || "Unknown error";
  const errorDigest = error?.digest || "";

  return {
    errorName,
    errorMessage,
    errorDigest,
  };
};

/**
 * Logs error details to console
 */
export const logErrorDetails = (error: Error & { digest?: string }): void => {
  const { errorName, errorMessage, errorDigest } = processError(error);

  console.error("Page error details:", {
    name: errorName,
    message: errorMessage,
    digest: errorDigest,
    stack: error?.stack,
  });
};

/**
 * Creates fallback error messages for Vietnamese locale
 */
export const getFallbackErrorMessages = (
  errorName: string,
  errorMessage: string,
): {
  title: string;
  message: string;
  retryLabel: string;
} => ({
  title: `Lỗi: ${errorName}`,
  message: `Chi tiết lỗi: ${errorMessage}\n\nVui lòng thử làm mới trang hoặc quay lại sau.`,
  retryLabel: "Thử lại",
});
