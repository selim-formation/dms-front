/**
 * Core API client
 * Configured Axios instance with all interceptors
 */

import type { AxiosInstance } from "axios";
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
 * Configured API client instance
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
   */
  getInstance(): AxiosInstance {
    return this.axios;
  }

  /**
   * Set current tenant for all requests
   */
  setTenant(tenantId: string | null): void {
    setTenantInterceptor(tenantId);
  }

  /**
   * Get current tenant
   */
  getTenant(): string | null {
    return getCurrentTenant();
  }

  /**
   * Initialize CSRF cookie
   */
  async initializeCsrf(): Promise<void> {
    return initializeCsrf(this.axios);
  }

  /**
   * Reset CSRF state
   */
  resetCsrf(): void {
    resetCsrfInterceptor();
  }

  /**
   * Set callback for unauthorized errors
   */
  onUnauthorized(callback: () => void): void {
    setUnauthorizedCallback(callback);
  }
}

/**
 * Export singleton instance
 */
export const apiClient = new ApiClient();

/**
 * Export axios instance for direct use
 */
export const axios = apiClient.getInstance();

/**
 * Export client class for testing
 */
export { ApiClient };
