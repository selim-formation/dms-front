/**
 * Login Endpoint Service
 * Handles global API login endpoint with HTTP-only cookie authentication
 */

import { apiClient } from "@/core/api/client";
import { apiEndpoints, buildApiUrl } from "@/config/api.config";
import type { LoginResponse } from "../types/api.types";
import type { LoginCredentials } from "../types";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Login Endpoint Service");

/**
 * Login to global API endpoint
 * Uses HTTP-only cookies for authentication (server injects cookie in response)
 * After successful login, CSRF is reset and reinitialized for subsequent requests
 */
export async function loginToGlobalEndpoint(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  try {
    log.debug("Attempting global login", { email: credentials.email });

    // Initialize CSRF cookie before login
    await apiClient.initializeCsrf();

    const url = buildApiUrl(apiEndpoints.auth.loginGlobal);
    const response = await apiClient.post<LoginResponse>(url, {
      email: credentials.email,
      password: credentials.password,
    });

    const data = response.data;

    // Reset CSRF state after successful login since server sets new HTTP-only cookie
    // This ensures subsequent requests get a fresh CSRF token initialization
    apiClient.resetCsrf();

    log.info("Global login successful", {
      userId: data.user.id,
      tenants: data.companies.length,
    });

    return response;
  } catch (error) {
    log.error("Global login failed", { data: error });
    throw error;
  }
}

/**
 * Clear auth session
 * Clears CSRF state (HTTP-only cookies are cleared by browser on logout)
 */
export function clearAuthSession(): void {
  apiClient.resetCsrf();
  log.info("Auth session cleared");
}
