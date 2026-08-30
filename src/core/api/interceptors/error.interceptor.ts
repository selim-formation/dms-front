/**
 * Error interceptor
 * Transforms and handles API errors globally
 */

import { AxiosError } from "axios";
import { logger } from "@/shared/utils/logger";
import { transformAxiosError } from "../types";
import { HTTP_STATUS } from "@/shared/utils/constants";

const log = logger.createScoped("Error Interceptor");

/**
 * Callback for handling unauthorized errors
 * Set by AuthProvider to trigger logout/redirect
 */
let onUnauthorizedCallback: (() => void) | null = null;

/**
 * Set callback for unauthorized errors
 */
export function setUnauthorizedCallback(callback: () => void): void {
  onUnauthorizedCallback = callback;
}

/**
 * Error response interceptor
 * Handles common error scenarios
 */
export function errorResponseInterceptor(error: AxiosError): Promise<never> {
  const status = error.response?.status;

  log.debug("Intercepting error", {
    data: {
      status,
      url: error.config?.url,
      method: error.config?.method,
    },
  });

  // Some endpoints report an expired/missing session as 403 with an
  // "Unauthenticated." message instead of a real 401 - treat both the same.
  const message = (error.response?.data as { message?: string } | undefined)?.message;
  const isUnauthenticated =
    status === HTTP_STATUS.UNAUTHORIZED ||
    (status === HTTP_STATUS.FORBIDDEN && message?.toLowerCase() === "unauthenticated.");

  if (isUnauthenticated) {
    log.warn("Unauthenticated request detected", { data: { status, message } });

    // Trigger auth callback (clears auth state, redirects to login)
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  } else if (status === HTTP_STATUS.FORBIDDEN) {
    log.warn("Forbidden request detected");
  }

  // Handle 404 Not Found
  if (status === HTTP_STATUS.NOT_FOUND) {
    log.debug("Resource not found");
  }

  // Handle 422 Validation Error
  if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    log.debug("Validation error");
  }

  // Handle 429 Too Many Requests
  if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    log.warn("Rate limit exceeded");
  }

  // Handle 500 Server Error
  if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    log.error("Server error");
  }

  // Transform and reject
  const apiError = transformAxiosError(error);
  return Promise.reject(apiError);
}
