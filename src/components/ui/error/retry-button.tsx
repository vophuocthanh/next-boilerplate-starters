import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type RetryButtonProps = {
  onClick: () => void;
  label?: string;
};

export const RetryButton = ({
  onClick,
  label = "Thử lại",
}: RetryButtonProps) => {
  return (
    <Button
      className="gap-2 bg-linear-to-r from-red-600 to-amber-600 px-6 text-white transition-all hover:from-red-700 hover:to-amber-700"
      size="lg"
      onClick={onClick}
    >
      <RefreshCcw className="size-5" />
      <span>{label}</span>
    </Button>
  );
};
