import type { PropsWithChildren, ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}>;

/** Presentational card wrapper shared by sign-in / sign-up forms. */
export function AuthCard({
  title,
  description,
  footer,
  className,
  children,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        "border-slate-200/80 bg-white/80 shadow-xl shadow-purple-500/5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-purple-900/10",
        className,
      )}
    >
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-blue-500 text-2xl shadow-lg shadow-purple-500/30">
          <span aria-hidden>⚡</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>{children}</CardContent>

      {footer ? (
        <CardFooter className="flex flex-col gap-2 border-t border-slate-200/60 pt-6 dark:border-slate-800/60">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
