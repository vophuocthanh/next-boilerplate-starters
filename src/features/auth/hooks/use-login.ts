"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

import { useRouter } from "@/app/i18n/navigation";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { QUERY_KEY } from "@/core/configs/query-key";
import { authApi } from "@/core/service/auth.service";
import { LoginResponse, Account } from "@/model/interface/auth.interface";

const LOGIN_THROTTLE_MS = 2000;

type UseLoginOptions = {
  redirectTo?: string;
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
};

export function useLogin(options: UseLoginOptions = {}) {
  const router = useRouter();
  const lastAttemptRef = useRef(0);
  const {
    redirectTo = ROUTE_CONSTANTS.DASHBOARD,
    onSuccess,
    onError,
  } = options;

  return useMutation({
    mutationKey: [QUERY_KEY.LOGIN],
    mutationFn: async (payload: Account) => {
      const now = Date.now();
      const elapsed = now - lastAttemptRef.current;
      if (elapsed < LOGIN_THROTTLE_MS) {
        await new Promise((r) => setTimeout(r, LOGIN_THROTTLE_MS - elapsed));
      }
      lastAttemptRef.current = Date.now();
      return authApi.login(payload);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      router.replace(redirectTo);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}
