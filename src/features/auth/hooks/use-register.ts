"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

import { useRouter } from "@/app/i18n/navigation";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { QUERY_KEY } from "@/core/configs/query-key";
import { authApi } from "@/core/service/auth.service";
import { RegisterResponse, Account } from "@/model/interface/auth.interface";

const REGISTER_THROTTLE_MS = 3000;

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
  const lastAttemptRef = useRef(0);
  const { redirectTo = ROUTE_CONSTANTS.SIGN_IN, onSuccess, onError } = options;

  return useMutation({
    mutationKey: [QUERY_KEY.REGISTER],
    mutationFn: async (payload: Account) => {
      const now = Date.now();
      const elapsed = now - lastAttemptRef.current;
      if (elapsed < REGISTER_THROTTLE_MS) {
        await new Promise((r) => setTimeout(r, REGISTER_THROTTLE_MS - elapsed));
      }
      lastAttemptRef.current = Date.now();
      return authApi.register(payload);
    },
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
