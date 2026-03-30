/**
 * Auth interceptor
 * Handles Bearer tokens and CSRF tokens for authentication
 */

import { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from "axios";
import { logger } from "@/shared/utils/logger";
import { appConfig } from "@/config/app.config";
import { getToken } from "@/core/auth/services/token.service";

const log = logger.createScoped("Auth Interceptor");

/**
 * Track if CSRF cookie has been initialized
 */
let csrfInitialized = false;

/**
 * Initialize CSRF cookie for Sanctum
 */
export async function initializeCsrf(
  axiosInstance: AxiosInstance,
): Promise<void> {
  if (csrfInitialized) {
    return;
  }

  try {
    log.debug("Initializing CSRF cookie");
    await axiosInstance.get(appConfig.auth.sanctumEndpoint);
    csrfInitialized = true;
    log.debug("CSRF cookie initialized");
  } catch (error) {
    log.error("Failed to initialize CSRF cookie", { data: error });
    throw error;
  }
}

/**
 * Reset CSRF initialization state
 * Useful when switching tenants or after logout
 */
export function resetCsrf(): void {
  csrfInitialized = false;
  log.debug("CSRF state reset");
}

/**
 * Auth request interceptor
 * Adds Bearer token and ensures CSRF token for protected requests
 * For HTTP-only cookie auth, CSRF must be initialized for all protected endpoints
 */
export async function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
  axiosInstance: AxiosInstance,
): Promise<InternalAxiosRequestConfig> {
  const url = config.url || "";

  // Add Bearer token if available
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    log.debug("Bearer token added to request");
  }

  // For HTTP-only cookie authentication, initialize CSRF for all API requests
  // This ensures the CSRF token is available for all protected endpoints
  const isApiRequest = url.includes("/api/");

  if (isApiRequest && !csrfInitialized) {
    try {
      await initializeCsrf(axiosInstance);
    } catch (error) {
      log.error("CSRF initialization failed", { data: error });
      // Continue anyway - it might work without CSRF
    }
  }

  return config;
}

/**
 * Auth response interceptor
 * Handles 419 CSRF token mismatch and 401 unauthorized errors
 */
export function authResponseErrorInterceptor(
  error: AxiosError,
  axiosInstance: AxiosInstance,
): Promise<any> {
  // Handle CSRF token mismatch
  if (error.response?.status === 419) {
    log.warn("CSRF token mismatch detected, reinitializing");

    // Reset CSRF and retry the request
    resetCsrf();

    return initializeCsrf(axiosInstance).then(() => {
      // Retry the original request
      if (error.config) {
        return axiosInstance.request(error.config);
      }
      return Promise.reject(error);
    });
  }

  // Handle 401 Unauthorized (token invalid/expired)
  if (error.response?.status === 401) {
    log.warn("Unauthorized response received");
    // Token will be handled by error interceptor
  }

  return Promise.reject(error);
}

/**
 * Get XSRF token from cookie (for debugging)
 */
export function getXsrfToken(): string | null {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
