/**
 * Login Form Hook
 * Handles form state and submission for login
 */

import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import { LoginFormData } from "../types";
import { logger } from "@/shared/utils/logger";
import { loginToGlobalEndpoint } from "@/core/auth/services/login-endpoint.service";
import {
  parseValidationErrors,
  getErrorMessage,
} from "../utils/error-handling";
import { axios } from "@/core/api/client";

const log = logger.createScoped("Login Form Hook");

interface UseLoginFormOptions {
  setError?: UseFormSetError<LoginFormData>;
}

export function useLoginForm(options?: UseLoginFormOptions) {
  const navigate = useNavigate();
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

        log.info("Login successful");
console.log(response.data);
        // Get first available tenant/company
        const tenant = response.data.companies[0];
        if (tenant) {
          log.debug("Navigating to dashboard", { tenant: tenant.id });
          navigate({ to: `/${tenant.id}/dashboard` });
        } else {
          log.warn("No tenant available for user");
          setError("No workspace available. Please contact support.");
        }
      } catch (err) {
        const axiosError = err as AxiosError<any>;
        const errorMessage = getErrorMessage(err);

        log.error("Login failed", { error: errorMessage });
        setError(errorMessage);

        // Set field-level validation errors
        if (options?.setError && axiosError.response?.status === 422) {
          const fieldErrors = parseValidationErrors(axiosError);
          Object.entries(fieldErrors).forEach(([field, message]) => {
            if (field === "email" || field === "password") {
              options.setError(field as keyof LoginFormData, {
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
    [navigate, options],
  );

  return { handleSubmit, isLoading, error, setError };
}
