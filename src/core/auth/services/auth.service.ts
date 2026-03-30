/**
 * Auth service
 * Handles authentication API calls
 */

import { apiClient } from "@/core/api/client";
import { buildApiUrl } from "@/config/api.config";
import type { AuthPayload, User } from "@/shared/types/common.types";
import type { LoginCredentials, RegisterData } from "../types";
import { initializeSanctum } from "./sanctum.service";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Auth Service");

/**
 * Login user
 */
export async function login(
  tenantId: string,
  credentials: LoginCredentials,
): Promise<User> {
  try {
    log.debug("Attempting login", { data: { email: credentials.email } });

    // Initialize CSRF cookie first
    await initializeSanctum();

    // Login request
    const url = buildApiUrl("/{tenant}/login", { tenant: tenantId });
    const response = await apiClient.post<{ data: User }>(url, credentials);

    log.info("Login successful");
    return response.data;
  } catch (error) {
    log.error("Login failed", { data: error });
    throw error;
  }
}

/**
 * Logout user
 */
export async function logout(tenantId: string): Promise<void> {
  try {
    log.debug("Attempting logout");

    const url = buildApiUrl("/{tenant}/logout", { tenant: tenantId });
    await apiClient.post(url);

    log.info("Logout successful");
  } catch (error) {
    log.error("Logout failed", { data: error });
    // Don't throw - we want to clear local state even if API call fails
  }
}

/**
 * Register new user
 */
export async function register(
  tenantId: string,
  data: RegisterData,
): Promise<User> {
  try {
    log.debug("Attempting registration", { data: { email: data.email } });

    // Initialize CSRF cookie first
    await initializeSanctum();

    const url = buildApiUrl("/{tenant}/register", { tenant: tenantId });
    const response = await apiClient.post<{ data: User }>(url, data);

    log.info("Registration successful");
    return response.data;
  } catch (error) {
    log.error("Registration failed", { data: error });
    throw error;
  }
}

/**
 * Get authenticated user
 */
export async function getUser(tenantId: string): Promise<AuthPayload> {
  const url = buildApiUrl("/api/me", { tenant: tenantId });

  const response = await apiClient.get<{ data: AuthPayload }>(url, {
    withCredentials: true,
  });

  return response.data;
}

/**
 * Get user permissions
 */
// export async function getUserPermissions(tenantId: string): Promise<string[]> {
//   try {
//     const url = buildApiUrl("/me/permissions", { tenant: tenantId });
//     const response = await apiClient.get<{ data: string[] }>(url);

//     return response.data.data;
//   } catch (error) {
//     log.error("Failed to fetch permissions", { data: error });
//     throw error;
//   }
// }

/**
 * Check if user is authenticated
 * Makes a lightweight request to verify session
 */
export async function checkAuth(tenantId: string): Promise<boolean> {
  try {
    await getUser(tenantId);
    return true;
  } catch (error) {
    return false;
  }
}
