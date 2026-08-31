/**
 * Error Handling Utilities
 *
 * Every request error that reaches a caller has already been through
 * the global error interceptor (`transformAxiosError`), which flattens
 * it into `ApiError { message, errors?, status? }` — not a raw
 * AxiosError. These helpers work off that flattened shape.
 */

import type { ApiError } from "@/core/api/types";

/**
 * Parse validation errors from an API error.
 */
export function parseValidationErrors(error: unknown): Record<string, string> {
  const errors: Record<string, string> = {};
  const apiErrors = (error as Partial<ApiError> | undefined)?.errors;

  if (apiErrors && typeof apiErrors === "object") {
    Object.entries(apiErrors).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        errors[key] = value[0];
      } else if (typeof value === "string") {
        errors[key] = value;
      }
    });
  }

  return errors;
}

/**
 * Get user-friendly error message from an API error.
 */
export function getErrorMessage(error: unknown): string {
  const apiError = error as Partial<ApiError> | undefined;

  if (apiError?.status !== undefined) {
    switch (apiError.status) {
      case 423:
        return "Your account has been locked. Please contact support.";
      case 429:
        return "Too many login attempts. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return apiError.message || "Login failed. Please try again.";
    }
  }

  if (apiError?.message) {
    return apiError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Get the HTTP status code from an API error, if any.
 */
export function getErrorStatus(error: unknown): number | undefined {
  return (error as Partial<ApiError> | undefined)?.status;
}
