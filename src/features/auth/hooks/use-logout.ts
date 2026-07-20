"use client";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "@/app/i18n/navigation";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { QUERY_KEY } from "@/core/configs/query-key";
import { authApi } from "@/core/service/auth.service";

type UseLogoutOptions = {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useLogout(options: UseLogoutOptions = {}) {
  const router = useRouter();
  const { redirectTo = ROUTE_CONSTANTS.HOME, onSuccess, onError } = options;

  return useMutation({
    mutationKey: [QUERY_KEY.LOGOUT],
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      onSuccess?.();
      router.replace(redirectTo);
      router.refresh();
    },
    onError: (error) => {
      onError?.(error);
      router.replace(redirectTo);
      router.refresh();
    },
  });
}
