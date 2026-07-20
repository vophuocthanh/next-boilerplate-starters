"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  showLabel?: string;
  hideLabel?: string;
};

/** Password field with show / hide toggle. Forwards all native input props. */
export function PasswordInput({
  className,
  showLabel = "Show password",
  hideLabel = "Hide password",
  disabled,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        disabled={disabled}
        autoComplete={props.autoComplete ?? "current-password"}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        className="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? hideLabel : showLabel}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  );
}
