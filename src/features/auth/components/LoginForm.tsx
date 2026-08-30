/**
 * Login Form Component
 * Form for user login with email and password
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { type LoginFormData } from "../types";
import { useLoginForm } from "../hooks/useLoginForm";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation(['auth', 'common']);

  // Validation schema
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t('auth:loginForm.emailRequired'))
      .email(t('auth:loginForm.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth:loginForm.passwordRequired'))
      .min(6, t('auth:loginForm.passwordMinLength')),
    remember: z.boolean().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const {
    handleSubmit: submitLogin,
    isLoading,
    error,
  } = useLoginForm({
    setError,
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    await submitLogin(data);
    // alert("Login successful! Navigating to dashboard...");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2">
          {t('auth:loginForm.emailAddress')}
        </label>
        <input
          id="email"
          type="email"
          placeholder={t('auth:loginForm.emailPlaceholder')}
          {...register("email")}
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
            errors.email
              ? "border-destructive focus:ring-2 focus:ring-destructive/20"
              : "border-border focus:ring-2 focus:ring-primary focus:border-transparent"
          } bg-card text-foreground placeholder:text-muted-foreground`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground mb-2">
          {t('auth:loginForm.password')}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t('auth:loginForm.passwordPlaceholder')}
            {...register("password")}
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
              errors.password
                ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                : "border-border focus:ring-2 focus:ring-primary focus:border-transparent"
            } bg-card text-foreground placeholder:text-muted-foreground pe-10`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}>
            {showPassword ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("remember")}
            className="w-4 h-4 rounded border-border accent-primary"
            disabled={isLoading}
          />
          <span className="text-sm text-muted-foreground">{t('auth:loginForm.rememberMe')}</span>
        </label>
        <a
          href="#"
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          {t('auth:loginForm.forgotPassword')}
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('auth:loginForm.signingIn')}
          </span>
        ) : (
          t('auth:loginForm.signIn')
        )}
      </button>
    </form>
  );
}
