/**
 * Login Form Hook
 * Handles form state and submission for login
 */

import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { UseFormSetError } from "react-hook-form";
import type { AxiosError } from "axios";
import type { LoginFormData } from "../types";
import { logger } from "@/shared/utils/logger";
import { loginToGlobalEndpoint } from "@/core/auth/services/login-endpoint.service";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import { setTenantCookie } from "@/core/tenant/services/tenant-cookie.service";
import {
  parseValidationErrors,
  getErrorMessage,
} from "../utils/error-handling";

const log = logger.createScoped("Login Form Hook");

interface UseLoginFormOptions {
  setError?: UseFormSetError<LoginFormData>;
}

export function useLoginForm(options?: UseLoginFormOptions) {
  const navigate = useNavigate();
  const { setTenantId } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        log.debug("Submitting login form", { email: data.email });

        const response = await loginToGlobalEndpoint({
          email: data.email,
          password: data.password,
          remember: data.remember,
        });

        log.info("Login successful", response);

        // Get first available tenant/company
        const tenant = response.data.companies[0];
        if (tenant) {
          log.debug("Setting tenant", { tenant: tenant.id });

          // Set tenant in cookie
          setTenantCookie(tenant.id);

          // Set tenant in context
          setTenantId(tenant.id);

          // Navigate to dashboard
          log.debug("Navigating to dashboard", { tenant: tenant.id });
          navigate({ to: `/${tenant.id}` });
        } else {
          log.warn("No tenant available for user");
          setError("No workspace available. Please contact support.");
        }
      } catch (err) {
        const axiosError = err as AxiosError<Record<string, unknown>>;
        const errorMessage = getErrorMessage(err);

        log.error("Login failed", { error: errorMessage });
        setError(errorMessage);

        // Set field-level validation errors
        if (options?.setError && axiosError.response?.status === 422) {
          const fieldErrors = parseValidationErrors(axiosError);
          const setError = options.setError;
          Object.entries(fieldErrors).forEach(([field, message]) => {
            if (field === "email" || field === "password") {
              setError(field as keyof LoginFormData, {
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
    [navigate, setTenantId, options],
  );

  return { handleSubmit, isLoading, error, setError };
}
