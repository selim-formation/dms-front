/**
 * Tenant API service
 * Handles tenant validation and retrieval
 */

import { axios } from "@/core/api/client";
import { buildApiUrl } from "@/config/api.config";
import { Tenant, TenantValidation } from "../types";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Tenant Service");

/**
 * Validate tenant exists and is active
 */
export async function validateTenant(
  tenantSlug: string,
): Promise<TenantValidation> {
  try {
    log.debug(`Validating tenant: ${tenantSlug}`);

    const url = buildApiUrl("/api/tenants/{tenant}/validate", {
      tenant: tenantSlug,
    });

    // Skip tenant injection for this specific endpoint
    const response = await axios.get<{ data: Tenant }>(url, {
      skipTenantInjection: true,
    } as any);

    log.info(`Tenant validated: ${tenantSlug}`);

    return {
      valid: true,
      tenant: response.data.data,
    };
  } catch (error: any) {
    log.error(`Tenant validation failed: ${tenantSlug}`, { data: error });

    return {
      valid: false,
      message:
        error.response?.data?.message || "Tenant not found or is not active",
    };
  }
}

/**
 * Get current tenant details
 */
export async function getCurrentTenant(tenantSlug: string): Promise<Tenant> {
  try {
    log.debug(`Fetching tenant details: ${tenantSlug}`);

    const url = buildApiUrl("/{tenant}/api/tenant", { tenant: tenantSlug });
    const response = await axios.get<{ data: Tenant }>(url);

    return response.data.data;
  } catch (error) {
    log.error(`Failed to fetch tenant: ${tenantSlug}`, { data: error });
    throw error;
  }
}

/**
 * Get tenant settings
 */
export async function getTenantSettings(tenantSlug: string): Promise<any> {
  try {
    const url = buildApiUrl("/{tenant}/api/tenant/settings", {
      tenant: tenantSlug,
    });
    const response = await axios.get(url);

    return response.data.data;
  } catch (error) {
    log.error(`Failed to fetch tenant settings: ${tenantSlug}`, {
      data: error,
    });
    throw error;
  }
}
