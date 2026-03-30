/**
 * Core API client
 * Configured Axios instance with all interceptors
 */

import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { createAxiosInstance } from "@/shared/lib/axios";
import { logger } from "@/shared/utils/logger";

// Interceptors
import {
  tenantRequestInterceptor,
  setCurrentTenant as setTenantInterceptor,
  getCurrentTenant,
} from "./interceptors/tenant.interceptor";

import {
  authRequestInterceptor,
  authResponseErrorInterceptor,
  initializeCsrf,
  resetCsrf as resetCsrfInterceptor,
} from "./interceptors/auth.interceptor";

import {
  errorResponseInterceptor,
  setUnauthorizedCallback,
} from "./interceptors/error.interceptor";

const log = logger.createScoped("API Client");

/**
 * Request configuration with AbortSignal support for request cancellation
 * Extends AxiosRequestConfig with AbortSignal for TanStack Query compatibility
 */
interface RequestConfig extends AxiosRequestConfig {
  signal?: AbortSignal;
}

/**
 * Configured API client instance
 * Provides type-safe HTTP methods with integrated interceptor support
 */
class ApiClient {
  private axios: AxiosInstance;

  constructor() {
    this.axios = createAxiosInstance();
    this.setupInterceptors();
    log.info("API Client initialized");
  }

  /**
   * Setup all interceptors
   * Order is critical for auth and CSRF handling
   */
  private setupInterceptors(): void {
    // Request interceptors (applied in reverse order)

    // 1. Auth interceptor (runs first)
    this.axios.interceptors.request.use(
      (config) => authRequestInterceptor(config, this.axios),
      (error) => Promise.reject(error),
    );

    // 2. Tenant interceptor (runs second)
    this.axios.interceptors.request.use(tenantRequestInterceptor, (error) =>
      Promise.reject(error),
    );

    // Response interceptors

    // 1. Auth response interceptor (handles CSRF errors)
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => authResponseErrorInterceptor(error, this.axios),
    );

    // 2. Error interceptor (handles all errors)
    this.axios.interceptors.response.use(
      (response) => response,
      errorResponseInterceptor,
    );
  }

  /**
   * Get Axios instance
   * @internal - Prefer using typed HTTP methods (get, post, etc.) instead
   * Only use this for advanced use cases or direct axios configuration
   */
  getInstance(): AxiosInstance {
    return this.axios;
  }

  /**
   * Perform a GET request
   * @template T - Response data type
   * @param url - Request URL
   * @param config - Optional request configuration with AbortSignal support
   * @returns Promise resolving to response data
   * @example
   * const user = await apiClient.get<User>('/api/users/123');
   * // With TanStack Query:
   * const query = useQuery({
   *   queryKey: ['user'],
   *   queryFn: ({ signal }) => apiClient.get<User>('/api/users/123', { signal })
   * });
   */
  async get<T = unknown>(
    url: string,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axios.get<T>(url, config);
    return response.data;
  }

  /**
   * Perform a POST request
   * @template T - Response data type
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Optional request configuration with AbortSignal support
   * @returns Promise resolving to response data
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axios.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Perform a PUT request
   * @template T - Response data type
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Optional request configuration with AbortSignal support
   * @returns Promise resolving to response data
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axios.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Perform a PATCH request
   * @template T - Response data type
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Optional request configuration with AbortSignal support
   * @returns Promise resolving to response data
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axios.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Perform a DELETE request
   * @template T - Response data type
   * @param url - Request URL
   * @param config - Optional request configuration with AbortSignal support
   * @returns Promise resolving to response data
   */
  async delete<T = unknown>(
    url: string,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axios.delete<T>(url, config);
    return response.data;
  }

  /**
   * Set current tenant for all subsequent requests
   * Integrates with tenant interceptor
   */
  setTenant(tenantId: string | null): void {
    setTenantInterceptor(tenantId);
  }

  /**
   * Get currently active tenant
   */
  getTenant(): string | null {
    return getCurrentTenant();
  }

  /**
   * Initialize CSRF token from server
   * Required for Laravel Sanctum authentication
   * Should be called once during app initialization
   */
  async initializeCsrf(): Promise<void> {
    return initializeCsrf(this.axios);
  }

  /**
   * Reset CSRF token state
   * Useful for logout or authentication changes
   */
  resetCsrf(): void {
    resetCsrfInterceptor();
  }

  /**
   * Register callback for unauthorized (401) errors
   * Typically used to redirect to login on auth failure
   */
  onUnauthorized(callback: () => void): void {
    setUnauthorizedCallback(callback);
  }
}

/**
 * Export singleton instance
 * Use this throughout the application for all HTTP requests
 */
export const apiClient = new ApiClient();

/**
 * Export client class for type reference, testing, and type-safe imports
 * @example
 * import { ApiClient } from '@/core/api/client';
 * type ClientType = ApiClient;
 */
export { ApiClient };
