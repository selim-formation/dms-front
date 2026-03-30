/**
 * Sanctum service
 * Handles Laravel Sanctum CSRF cookie
 */

import { apiClient } from "@/core/api/client";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Sanctum Service");

/**
 * Initialize CSRF cookie from Sanctum
 * Must be called before any state-changing requests
 */
export async function initializeSanctum(): Promise<void> {
  try {
    log.debug("Initializing Sanctum CSRF cookie");
    await apiClient.initializeCsrf();
    log.info("Sanctum initialized successfully");
  } catch (error) {
    log.error("Failed to initialize Sanctum", { data: error });
    throw new Error("Failed to initialize authentication. Please try again.");
  }
}

/**
 * Reset Sanctum state
 * Useful when switching tenants or after logout
 */
export function resetSanctum(): void {
  apiClient.resetCsrf();
  log.debug("Sanctum reset");
}
