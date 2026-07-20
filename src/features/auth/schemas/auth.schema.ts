import { z } from "zod";

import { REGEX } from "@/core/constant/regex";

/** Shared auth validation limits — single source of truth for schemas & UI. */
export const AUTH_VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 72,
  PHONE_PATTERN: REGEX.PHONE,
} as const;

/** Message keys resolved via `auth.validation.*` in dictionaries. */
export const AUTH_ERROR_KEYS = {
  REQUIRED: "required",
  INVALID_EMAIL: "invalidEmail",
  INVALID_PHONE: "invalidPhone",
  NAME_MIN: "nameMin",
  PASSWORD_MIN: "passwordMin",
  PASSWORD_MISMATCH: "passwordMismatch",
  ACCEPT_TERMS: "acceptTerms",
} as const;

const requiredString = z
  .string()
  .trim()
  .min(1, { message: AUTH_ERROR_KEYS.REQUIRED });

const emailSchema = requiredString.email({
  message: AUTH_ERROR_KEYS.INVALID_EMAIL,
});

const passwordSchema = requiredString
  .min(AUTH_VALIDATION.PASSWORD_MIN, {
    message: AUTH_ERROR_KEYS.PASSWORD_MIN,
  })
  .max(AUTH_VALIDATION.PASSWORD_MAX);

const optionalPhoneSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.length === 0 ||
      AUTH_VALIDATION.PHONE_PATTERN.test(value.replace(/\s/g, "")),
    { message: AUTH_ERROR_KEYS.INVALID_PHONE },
  );

export const signInSchema = z.object({
  email: emailSchema,
  password: requiredString,
  rememberMe: z.boolean(),
});

export const signUpSchema = z
  .object({
    name: requiredString
      .min(AUTH_VALIDATION.NAME_MIN, { message: AUTH_ERROR_KEYS.NAME_MIN })
      .max(AUTH_VALIDATION.NAME_MAX),
    email: emailSchema,
    phone: optionalPhoneSchema,
    password: passwordSchema,
    confirmPassword: requiredString,
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: AUTH_ERROR_KEYS.ACCEPT_TERMS,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_ERROR_KEYS.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
