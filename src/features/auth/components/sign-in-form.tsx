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
import { useAuthValidationMessage } from "@/features/auth/hooks/use-auth-validation-message";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  signInSchema,
  type SignInFormValues,
} from "@/features/auth/schemas/auth.schema";

const DEFAULT_VALUES: SignInFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export function SignInForm() {
  const t = useTranslations("auth");
  const resolveMessage = useAuthValidationMessage();
  const login = useLogin();

  const form = useForm<SignInFormValues>({
    resolver: createZodResolver(signInSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });

  const { control, handleSubmit } = form;
  const isPending = login.isPending;

  const onSubmit = (values: SignInFormValues) => {
    login.mutate({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <AuthCard
      title={t("signInTitle")}
      description={t("signInDescription")}
      footer={
        <p className="w-full text-center text-sm text-slate-600 dark:text-slate-400">
          {t("noAccount")}{" "}
          <Link
            href={ROUTE_CONSTANTS.SIGN_UP}
            className="font-medium text-purple-600 underline-offset-4 hover:underline dark:text-purple-400"
          >
            {t("signUp")}
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
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-2">
                  <FormLabel>{t("password")}</FormLabel>
                  <Link
                    href={ROUTE_CONSTANTS.FORGOT_PASSWORD}
                    className="text-xs font-medium text-purple-600 underline-offset-4 hover:underline dark:text-purple-400"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder={t("passwordPlaceholder")}
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
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    disabled={isPending}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal">
                  {t("rememberMe")}
                </FormLabel>
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
                {t("signingIn")}
              </>
            ) : (
              t("signIn")
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
