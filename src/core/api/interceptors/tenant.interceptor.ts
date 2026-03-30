/**
 * Tenant interceptor
 * Automatically injects tenant ID into API requests
 */

import type { InternalAxiosRequestConfig } from "axios";
import { logger } from "@/shared/utils/logger";
import type { ApiRequestConfig } from "../types";

const log = logger.createScoped("Tenant Interceptor");

/**
 * Get current tenant ID from context
 * This will be set by the TenantProvider
 */
let currentTenantId: string | null = null;

/**
 * Set current tenant ID
 */
export function setCurrentTenant(tenantId: string | null): void {
  currentTenantId = tenantId;
  log.debug(`Tenant set to: ${tenantId}`);
}

/**
 * Get current tenant ID
 */
export function getCurrentTenant(): string | null {
  return currentTenantId;
}

/**
 * Tenant request interceptor
 * Injects tenant ID into request URL or headers
 */
export function tenantRequestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  // Skip if explicitly disabled
  const customConfig = config as InternalAxiosRequestConfig & ApiRequestConfig;
  if (customConfig.skipTenantInjection) {
    return config;
  }

  // Skip for non-tenant endpoints (auth, public routes)
  if (shouldSkipTenantInjection(config.url || "")) {
    return config;
  }

  // Inject tenant ID
  if (currentTenantId) {
    // Replace {tenant} placeholder in URL
    if (config.url?.includes("{tenant}")) {
      config.url = config.url.replace("{tenant}", currentTenantId);
      log.debug(`Injected tenant into URL: ${config.url}`);
    }

    // Add tenant header as fallback
    config.headers.set("X-Tenant-ID", currentTenantId);
  } else {
    // If URL requires tenant but none is set, log warning
    if (config.url?.includes("{tenant}")) {
      log.warn("Tenant ID required but not set", { data: { url: config.url } });
    }
  }

  return config;
}

/**
 * Check if request should skip tenant injection
 */
function shouldSkipTenantInjection(url: string): boolean {
  const skipPatterns = [
    "/sanctum/csrf-cookie",
    "/api/tenants/", // Tenant validation endpoint
  ];

  return skipPatterns.some((pattern) => url.includes(pattern));
}
