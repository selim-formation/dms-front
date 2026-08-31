/**
 * Tenant API service
 * Handles tenant validation and retrieval
 */

import { axios } from "@/core/api/client";
import { buildApiUrl } from "@/config/api.config";
import type { TenantValidationResult } from "../types";
import type { ApiError } from "@/core/api/types";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Tenant Service");

/**
 * React Query key for a tenant's validation result. Shared by every
 * caller (router guard, TenantProvider) so they hit one cache entry
 * instead of each firing their own request.
 */
export const tenantValidateQueryKey = (tenantSlug: string) =>
  ["tenant", "validate", tenantSlug] as const;

/**
 * Matches the backend's own /api/me cache TTL (15s) so a tenant isn't
 * re-validated on every nav within the same tenant.
 */
export const TENANT_VALIDATE_STALE_TIME = 15_000;

/**
 * Validate a tenant (by id or slug) and whether the current user has
 * access to it. GET /api/tenants/{tenant}/validate answers gracefully
 * (404/403/200) instead of throwing hard tenancy exceptions.
 */
export async function validateTenant(
  tenantSlug: string,
): Promise<TenantValidationResult> {
  try {
    log.debug(`Validating tenant: ${tenantSlug}`);

    const url = buildApiUrl("/api/tenants/{tenant}/validate", {
      tenant: tenantSlug,
    });

    const response = await axios.get<{
      data: { tenant_exists: boolean; has_access: boolean };
      message: string;
    }>(url, {
      // Skip tenant injection for this specific endpoint
      skipTenantInjection: true,
    } as any);

    const { tenant_exists, has_access } = response.data.data;
    log.info(`Tenant validated: ${tenantSlug}`, {
      data: { tenant_exists, has_access },
    });

    return {
      kind: tenant_exists && has_access ? "valid" : "access_denied",
      tenantExists: tenant_exists,
      hasAccess: has_access,
      message: response.data.message,
    };
  } catch (err) {
    // Already normalized by the global error interceptor into a flat
    // ApiError { message, status } — not a raw AxiosError.
    const error = err as Partial<ApiError>;
    const status = error?.status;
    const message = error?.message;

    log.error(`Tenant validation failed: ${tenantSlug}`, {
      data: { status, message },
    });

    if (status === 404) {
      return { kind: "not_found", tenantExists: false, hasAccess: false, message };
    }
    if (status === 403) {
      return { kind: "access_denied", tenantExists: true, hasAccess: false, message };
    }
    if (status === 401) {
      return { kind: "unauthenticated", tenantExists: false, hasAccess: false, message };
    }
    return {
      kind: "error",
      tenantExists: false,
      hasAccess: false,
      message: message || "Tenant not found or is not active",
    };
  }
}
