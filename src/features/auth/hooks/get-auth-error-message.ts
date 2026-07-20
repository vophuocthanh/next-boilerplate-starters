import { HttpError } from "@/core/service/http-client";

export function getAuthErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (error instanceof HttpError) {
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
