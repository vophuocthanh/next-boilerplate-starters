import type { PropsWithChildren } from "react";

import { AuthShell } from "@/features/auth";

export default function AuthLayout({ children }: PropsWithChildren) {
  return <AuthShell>{children}</AuthShell>;
}
