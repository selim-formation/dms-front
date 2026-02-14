/**
 * Error mapper - maps API errors to user-friendly messages
 */

import { ApiError } from "../types/api.types";
import { ERROR_MESSAGES } from "./constants";

/**
 * Map API error to user-friendly message
 */
export function mapApiErrorToMessage(error: unknown): string {
  // Handle API error responses
  if (isApiError(error)) {
    return error.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  // Handle network errors
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Handle timeout errors
  if (isTimeoutError(error)) {
    return "Request timed out. Please try again.";
  }

  // Handle abort errors
  if (isAbortError(error)) {
    return "Request was cancelled.";
  }

  // Handle generic errors with message
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  if (typeof error === "string") {
    return error;
  }

  return ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("Network Error") ||
      error.message.includes("Failed to fetch"))
  );
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("timeout") || error.message.includes("ETIMEDOUT"))
  );
}

/**
 * Check if error is an abort error
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

/**
 * Get validation errors from API error
 */
export function getValidationErrors(
  error: unknown,
): Record<string, string[]> | null {
  if (isApiError(error) && error.errors) {
    return error.errors;
  }
  return null;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(
  errors: Record<string, string[]>,
): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("\n");
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatus(error: unknown): number | null {
  if (isApiError(error) && typeof error.status === "number") {
    return error.status;
  }
  return null;
}

/**
 * Check if error is a specific HTTP status
 */
export function isHttpStatus(error: unknown, status: number): boolean {
  return getErrorStatus(error) === status;
}

/**
 * Check if error is 401 Unauthorized
 */
export function isUnauthorizedError(error: unknown): boolean {
  return isHttpStatus(error, 401);
}

/**
 * Check if error is 403 Forbidden
 */
export function isForbiddenError(error: unknown): boolean {
  return isHttpStatus(error, 403);
}

/**
 * Check if error is 404 Not Found
 */
export function isNotFoundError(error: unknown): boolean {
  return isHttpStatus(error, 404);
}

/**
 * Check if error is 422 Validation Error
 */
export function isValidationError(error: unknown): boolean {
  return isHttpStatus(error, 422);
}
