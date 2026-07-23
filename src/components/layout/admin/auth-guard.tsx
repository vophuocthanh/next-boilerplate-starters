"use client";

import { Loader2 } from "lucide-react";
import { type ReactNode, useEffect } from "react";

import { useRouter } from "@/app/i18n/navigation";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { getAccessToken } from "@/core/utils/storage";
import { useMounted } from "@/hooks/use-mounted";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const mounted = useMounted();
  const token = mounted ? getAccessToken() : null;

  useEffect(() => {
    if (!mounted) return;
    if (!getAccessToken()) {
      router.replace(ROUTE_CONSTANTS.SIGN_IN);
    }
  }, [mounted, router]);

  if (!mounted || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
          <p className="text-sm">Đang xác thực…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
