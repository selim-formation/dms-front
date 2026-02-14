/**
 * Core API types and interfaces
 */

import { AxiosError, AxiosRequestConfig } from "axios";
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
 * Transform Axios error to ApiError
 */
export function transformAxiosError(error: AxiosError): ApiError {
  const response = error.response;

  if (response) {
    // Server responded with error
    const data = response.data as any;

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
