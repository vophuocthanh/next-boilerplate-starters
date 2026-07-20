export { AuthShell } from "./components/auth-shell";
export { SignInForm } from "./components/sign-in-form";
export { SignUpForm } from "./components/sign-up-form";

// Hooks
export { getAuthErrorMessage } from "./hooks/get-auth-error-message";
export { useLogin } from "./hooks/use-login";
export { useLogout } from "./hooks/use-logout";
export { useRegister } from "./hooks/use-register";

// Schemas
export {
  AUTH_ERROR_KEYS,
  AUTH_VALIDATION,
  signInSchema,
  signUpSchema,
  type SignInFormValues,
  type SignUpFormValues,
} from "./schemas/auth.schema";
