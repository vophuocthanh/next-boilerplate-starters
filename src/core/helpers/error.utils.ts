import type { ProcessedError } from "@/model/interface/error.interface";

const isProduction = process.env.NODE_ENV === "production";

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

export const logErrorDetails = (error: Error & { digest?: string }): void => {
  const { errorName, errorMessage, errorDigest } = processError(error);

  if (isProduction) {
    console.error("Page error:", {
      name: errorName,
      digest: errorDigest,
    });
  } else {
    console.error("Page error details:", {
      name: errorName,
      message: errorMessage,
      digest: errorDigest,
      stack: error?.stack,
    });
  }
};
