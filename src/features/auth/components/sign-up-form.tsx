"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Link } from "@/app/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTE_CONSTANTS } from "@/core/constant/route";
import { createZodResolver } from "@/core/helpers/create-zod-resolver";
import { AuthCard } from "@/features/auth/components/auth-card";
import { PasswordInput } from "@/features/auth/components/password-input";
import { getAuthErrorMessage } from "@/features/auth/hooks/get-auth-error-message";
import { useAuthValidationMessage } from "@/features/auth/hooks/use-auth-validation-message";
import { useRegister } from "@/features/auth/hooks/use-register";
import {
  AUTH_VALIDATION,
  signUpSchema,
  type SignUpFormValues,
} from "@/features/auth/schemas/auth.schema";

const DEFAULT_VALUES: SignUpFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export function SignUpForm() {
  const t = useTranslations("auth");
  const resolveMessage = useAuthValidationMessage();
  const register = useRegister();

  const form = useForm<SignUpFormValues>({
    resolver: createZodResolver(signUpSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });

  const { control, handleSubmit } = form;
  const isPending = register.isPending;

  const onSubmit = (values: SignUpFormValues) => {
    register.mutate({
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <AuthCard
      title={t("signUpTitle")}
      description={t("signUpDescription")}
      footer={
        <p className="w-full text-center text-sm text-slate-600 dark:text-slate-400">
          {t("hasAccount")}{" "}
          <Link
            href={ROUTE_CONSTANTS.SIGN_IN}
            className="font-medium text-purple-600 underline-offset-4 hover:underline dark:text-purple-400"
          >
            {t("signIn")}
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {register.isError ? (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {getAuthErrorMessage(register.error, t("registerFailed"))}
            </p>
          ) : null}

          <FormField
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="name"
                    placeholder={t("namePlaceholder")}
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {resolveMessage(fieldState.error?.message)}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {resolveMessage(fieldState.error?.message)}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  {t("phone")}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({t("optional")})
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={t("phonePlaceholder")}
                    disabled={isPending}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage>
                  {resolveMessage(fieldState.error?.message)}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder={t("passwordPlaceholder")}
                    showLabel={t("showPassword")}
                    hideLabel={t("hidePassword")}
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {resolveMessage(fieldState.error?.message) ??
                    (!fieldState.error
                      ? t("passwordHint", {
                          min: AUTH_VALIDATION.PASSWORD_MIN,
                        })
                      : undefined)}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    showLabel={t("showPassword")}
                    hideLabel={t("hidePassword")}
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {resolveMessage(fieldState.error?.message)}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="acceptTerms"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <div className="flex flex-row items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={isPending}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      className="mt-0.5"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-normal leading-snug">
                    {t("acceptTerms")}
                  </FormLabel>
                </div>
                <FormMessage>
                  {resolveMessage(fieldState.error?.message)}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-10 w-full bg-linear-to-r from-purple-600 to-blue-600 font-semibold text-white shadow-md shadow-purple-500/25 hover:from-purple-700 hover:to-blue-700"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t("signingUp")}
              </>
            ) : (
              t("signUp")
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
