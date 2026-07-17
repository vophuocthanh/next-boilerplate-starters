"use client";

import { AnimatedBackground } from "@/components/ui/error/animated-background";
import {
  AnimatedErrorLines,
  AnimatedParticles,
} from "@/components/ui/error/animated-decorations";
import { ErrorContent } from "@/components/ui/error/error-content";
import { AnimatedErrorIcon } from "@/components/ui/error/error-icon";
import { ErrorId } from "@/components/ui/error/error-id";
import { RetryButton } from "@/components/ui/error/retry-button";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
  retryLabel?: string;
};

export const AppError = ({
  error,
  reset,
  title = "Đã xảy ra lỗi",
  message = "Rất tiếc, đã xảy ra lỗi khi xử lý yêu cầu của bạn.\nVui lòng thử làm mới trang hoặc quay lại sau.",
  retryLabel = "Thử lại",
}: AppErrorProps) => {
  const safeError = error || new Error("Unknown error");

  const handleReset = () => {
    if (typeof reset === "function") {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mx-auto w-full max-w-xl">
        <AnimatedBackground />
        <AnimatedErrorLines />
        <AnimatedParticles />

        <div className="relative z-10">
          <AnimatedErrorIcon />
          <ErrorContent message={message} title={title} />

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in animation-delay-200">
            <RetryButton label={retryLabel} onClick={handleReset} />
            <ErrorId digest={safeError.digest} />
          </div>
        </div>
      </div>
    </div>
  );
};
