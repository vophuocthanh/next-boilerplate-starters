import type { ProcessedError } from "@/model/interface/error.interface";

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

  console.error("Page error details:", {
    name: errorName,
    message: errorMessage,
    digest: errorDigest,
    stack: error?.stack,
  });
};
