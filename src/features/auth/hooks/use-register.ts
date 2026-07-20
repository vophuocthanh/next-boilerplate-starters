"use client";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "@/app/i18n/navigation";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { QUERY_KEY } from "@/core/configs/query-key";
import { authApi } from "@/core/service/auth.service";
import { RegisterResponse, Account } from "@/model/interface/auth.interface";

type UseRegisterOptions = {
  redirectTo?: string;
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: Error) => void;
};

/**
 * Register mutation — API lives in the feature layer, not in page UI.
 * On success: navigate to sign-in.
 */
export function useRegister(options: UseRegisterOptions = {}) {
  const router = useRouter();
  const { redirectTo = ROUTE_CONSTANTS.SIGN_IN, onSuccess, onError } = options;

  return useMutation({
    mutationKey: [QUERY_KEY.REGISTER],
    mutationFn: (payload: Account) => authApi.register(payload),
    onSuccess: (data) => {
      onSuccess?.(data);
      router.replace(redirectTo);
      router.refresh();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}
