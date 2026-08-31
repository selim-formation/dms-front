/**
 * Auth service
 * Handles authentication API calls against the flat, tenant-agnostic
 * /api/login, /api/logout, /api/me endpoints. Auth is an httpOnly
 * `access_token` cookie set directly by the server — never readable
 * or stored client-side.
 */

import { apiClient } from "@/core/api/client";
import { buildApiUrl, apiEndpoints } from "@/config/api.config";
import type { User } from "@/shared/types/common.types";
import type { LoginCredentials, RegisterData } from "../types";
import type { LoginResponse, MeResponse } from "../types/api.types";
import { initializeSanctum } from "./sanctum.service";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Auth Service");

/**
 * Login user (POST /api/login)
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse["data"]> {
  try {
    log.debug("Attempting login", { data: { email: credentials.email } });

    const url = buildApiUrl(apiEndpoints.auth.loginGlobal);
    const response = await apiClient.getInstance().post<LoginResponse>(
      url,
      { email: credentials.email, password: credentials.password },
      { withCredentials: true },
    );

    log.info("Login successful");
    return response.data.data;
  } catch (error) {
    log.error("Login failed", { data: error });
    throw error;
  }
}

/**
 * Logout user (POST /api/logout)
 */
export async function logout(): Promise<void> {
  try {
    log.debug("Attempting logout");

    await apiClient.getInstance().post(
      "/api/logout",
      {},
      { withCredentials: true },
    );

    log.info("Logout successful");
  } catch (error) {
    log.error("Logout failed", { data: error });
    // Don't throw - we want to clear local state even if API call fails
  }
}

/**
 * Register new user
 * (Not covered by the current backend spec — still tenant-scoped.)
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
    const response = await apiClient
      .getInstance()
      .post<{ data: User }>(url, data);

    log.info("Registration successful");
    return response.data.data;
  } catch (error) {
    log.error("Registration failed", { data: error });
    throw error;
  }
}

/**
 * Get authenticated user (GET /api/me)
 * Bootstraps the session on app load — tenant-agnostic.
 */
export async function getMe(): Promise<MeResponse> {
  const response = await apiClient
    .getInstance()
    .get<{ data: MeResponse; message: string }>("/api/me", {
      withCredentials: true,
    });

  return response.data.data;
}

/**
 * Check if user is authenticated
 * Makes a lightweight request to verify session
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await getMe();
    return true;
  } catch {
    return false;
  }
}
