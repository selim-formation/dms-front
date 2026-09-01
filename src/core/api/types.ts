/**
 * Core API types and interfaces
 */

import type { AxiosError, AxiosRequestConfig } from "axios";
import type { ApiError as SharedApiError } from "@/shared/types/api.types";

/**
 * API error type (extends shared type with Axios specifics)
 */
export interface ApiError extends SharedApiError {
  status?: number;
  code?: string;
  requestId?: string;
}

/**
 * API request config
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  skipTenantInjection?: boolean;
  skipAuthInterceptor?: boolean;
}

/**
 * True when `data` is a raw Laravel validator payload — field names at
 * the top level, each an array of messages — with no `message`/`errors`
 * wrapper. Some endpoints on this backend (e.g. POST /api/login) return
 * 422s in exactly this shape instead of the usual `{message, errors}`.
 */
function isRawValidationErrors(data: unknown): data is Record<string, string[]> {
  return (
    !!data &&
    typeof data === "object" &&
    !("message" in data) &&
    !("errors" in data) &&
    !("data" in data) &&
    Object.values(data as Record<string, unknown>).every(
      (v) => Array.isArray(v) && v.every((m) => typeof m === "string"),
    )
  );
}

/**
 * Transform Axios error to ApiError
 */
export function transformAxiosError(error: AxiosError): ApiError {
  const response = error.response;

  if (response) {
    // Server responded with error
    const data = response.data as any;

    if (isRawValidationErrors(data)) {
      return {
        message: Object.values(data)[0]?.[0] || "Validation failed",
        errors: data,
        status: response.status,
      };
    }

    return {
      message: data?.message || error.message,
      errors: data?.errors,
      code: data?.code,
      status: response.status,
    };
  }

  if (error.request) {
    // Request made but no response
    return {
      message: "Network error. Please check your connection.",
      status: 0,
      code: "NETWORK_ERROR",
    };
  }

  // Something went wrong setting up the request
  return {
    message: error.message,
    code: "REQUEST_ERROR",
  };
}
