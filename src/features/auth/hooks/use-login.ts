"use client";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "@/app/i18n/navigation";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { QUERY_KEY } from "@/core/configs/query-key";
import { authApi } from "@/core/service/auth.service";
import { LoginResponse, Account } from "@/model/interface/auth.interface";

type UseLoginOptions = {
  redirectTo?: string;
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
};

export function useLogin(options: UseLoginOptions = {}) {
  const router = useRouter();
  const {
    redirectTo = ROUTE_CONSTANTS.DASHBOARD,
    onSuccess,
    onError,
  } = options;

  return useMutation({
    mutationKey: [QUERY_KEY.LOGIN],
    mutationFn: (payload: Account) => authApi.login(payload),
    onSuccess: (data) => {
      onSuccess?.(data);
      router.replace(redirectTo);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}
