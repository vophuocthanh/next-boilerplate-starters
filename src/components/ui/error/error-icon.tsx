import { AlertTriangle } from "lucide-react";

export const AnimatedErrorIcon = () => {
  return (
    <div className="mx-auto mb-6 flex justify-center animate-fade-in-up">
      <div className="relative">
        <div className="absolute -inset-1 animate-pulse rounded-full bg-red-500/30 blur-lg" />
        <AlertTriangle className="relative size-24 text-red-500" />
      </div>
    </div>
  );
};
