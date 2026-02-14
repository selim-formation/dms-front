/**
 * Centralized API error handler
 * Transforms errors and provides user-friendly messages
 */

import { AxiosError } from "axios";
import { ApiError, transformAxiosError } from "./types";
import { logger } from "@/shared/utils/logger";
import {
  mapApiErrorToMessage,
  isUnauthorizedError,
  isForbiddenError,
  isValidationError,
} from "@/shared/utils/error-mapper";
import { ERROR_MESSAGES } from "@/shared/utils/constants";

const errorLogger = logger.createScoped("API Error Handler");

/**
 * Handle API errors consistently across the application
 */
export function handleApiError(error: unknown): never {
  let apiError: ApiError;

  // Transform different error types to ApiError
  if (error instanceof AxiosError) {
    apiError = transformAxiosError(error);
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    apiError = error as ApiError;
  } else {
    apiError = {
      message: ERROR_MESSAGES.SERVER_ERROR,
    };
  }

  // Log error for debugging
  errorLogger.error("API Error", {
    data: {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      errors: apiError.errors,
    },
  });

  // Handle specific error types
  if (isUnauthorizedError(apiError)) {
    handleUnauthorizedError(apiError);
  } else if (isForbiddenError(apiError)) {
    handleForbiddenError(apiError);
  } else if (isValidationError(apiError)) {
    handleValidationError(apiError);
  }

  // Throw the transformed error
  throw apiError;
}

/**
 * Handle 401 Unauthorized errors
 */
function handleUnauthorizedError(error: ApiError): void {
  errorLogger.warn("Unauthorized access detected");

  // Clear auth state and redirect to login
  // This will be handled by the auth interceptor
  // We just ensure the error has a user-friendly message
  error.message = ERROR_MESSAGES.UNAUTHORIZED;
}

/**
 * Handle 403 Forbidden errors
 */
function handleForbiddenError(error: ApiError): void {
  errorLogger.warn("Forbidden access detected");
  error.message = ERROR_MESSAGES.FORBIDDEN;
}

/**
 * Handle 422 Validation errors
 */
function handleValidationError(error: ApiError): void {
  errorLogger.debug("Validation error", { data: error.errors });

  // If there are specific validation errors, keep them
  // Otherwise provide a generic message
  if (!error.errors || Object.keys(error.errors).length === 0) {
    error.message = ERROR_MESSAGES.VALIDATION_ERROR;
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  return mapApiErrorToMessage(error);
}

/**
 * Check if error requires authentication
 */
export function requiresAuthentication(error: unknown): boolean {
  return isUnauthorizedError(error);
}

/**
 * Check if error is permission-related
 */
export function isPermissionError(error: unknown): boolean {
  return isForbiddenError(error);
}
