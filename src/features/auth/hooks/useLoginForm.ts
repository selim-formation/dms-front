/**
 * Login Form Hook
 * Handles form state and submission for login
 */

import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { UseFormSetError } from "react-hook-form";
import type { LoginFormData } from "../types";
import { logger } from "@/shared/utils/logger";
import { useAuth } from "@/core/auth/hooks/useAuth";
import { getTenantCookie } from "@/core/tenant/services/tenant-cookie.service";
import {
  parseValidationErrors,
  getErrorMessage,
  getErrorStatus,
} from "../utils/error-handling";

const log = logger.createScoped("Login Form Hook");

interface UseLoginFormOptions {
  setError?: UseFormSetError<LoginFormData>;
}

export function useLoginForm(options?: UseLoginFormOptions) {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        log.debug("Submitting login form", { email: data.email });

        const companies = await login({
          email: data.email,
          password: data.password,
        });

        log.info("Login successful");

        if (companies.length === 0) {
          // Nothing to land on — don't leave a stuck, half-authenticated
          // session sitting on the login page.
          log.warn("No tenant available for user, logging out");
          setError("No workspace available. Please contact support.");
          await logout();
          return;
        }

        // Prefer the last tenant this user was in (cached on login),
        // as long as they still have access to it.
        const cachedTenantId = getTenantCookie();
        const tenant =
          companies.find(
            (c) => c.slug === cachedTenantId || c.id === cachedTenantId,
          ) ?? companies[0];

        log.debug("Navigating to home", { tenant: tenant.slug ?? tenant.id });
        navigate({
          to: "/$tenant",
          params: { tenant: tenant.slug ?? tenant.id },
        });
      } catch (err) {
        const errorMessage = getErrorMessage(err);

        log.error("Login failed", { error: errorMessage });
        setError(errorMessage);

        // Set field-level validation errors
        const setFieldError = options?.setError;
        if (setFieldError && getErrorStatus(err) === 422) {
          const fieldErrors = parseValidationErrors(err);
          Object.entries(fieldErrors).forEach(([field, message]) => {
            if (field === "email" || field === "password") {
              setFieldError(field as keyof LoginFormData, {
                type: "server",
                message,
              });
            }
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, login, logout, options],
  );

  return { handleSubmit, isLoading, error, setError };
}
