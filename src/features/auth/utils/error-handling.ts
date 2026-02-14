/**
 * Error Handling Utilities
 */

import { AxiosError } from "axios";

/**
 * Parse validation errors from API response
 */
export function parseValidationErrors(
  error: AxiosError<any>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (error.response?.data?.errors) {
    const apiErrors = error.response.data.errors;

    // Handle both array and object error formats
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
 * Get user-friendly error message from API response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    switch (error.response?.status) {
      case 401:
      case 422:
        return "Invalid email or password. Please try again.";
      case 423:
        return "Your account has been locked. Please contact support.";
      case 429:
        return "Too many login attempts. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.message || "Login failed. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}
