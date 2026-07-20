import type { PropsWithChildren } from "react";

import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";

/**
 * Shared chrome for auth routes: gradient backdrop, brand accents,
 * and locale / theme controls. Page content (forms) is slotted via children.
 */
export function AuthShell({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-purple-50 to-blue-50 px-4 py-12 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
        aria-hidden
      />

      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 sm:top-6 sm:right-6">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <main className="relative z-10 w-full max-w-md">{children}</main>
    </div>
  );
}
