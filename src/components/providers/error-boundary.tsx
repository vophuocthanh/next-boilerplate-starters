"use client";

import { ErrorView } from "@/components/ui/error/error-view";
import { type ReactNode, type ErrorInfo } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: React.ReactElement | ((props: FallbackProps) => React.ReactNode);
  onError?: (error: Error, info: ErrorInfo) => void;
};

export function ErrorBoundary({
  children,
  fallback,
  onError,
}: ErrorBoundaryProps) {
  const handleError = (error: Error, info: ErrorInfo) => {
    console.error("ErrorBoundary caught an error:", error, info);
    onError?.(error, info);
  };

  const renderFallback = (props: FallbackProps) => {
    if (fallback) {
      return typeof fallback === "function" ? fallback(props) : fallback;
    }

    return (
      <ErrorView
        message={props.error?.message || "Đã xảy ra lỗi không mong muốn."}
        showRetry={true}
        title="Component Error"
        onRetry={props.resetErrorBoundary}
      />
    );
  };

  return (
    <ReactErrorBoundary fallbackRender={renderFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
}
