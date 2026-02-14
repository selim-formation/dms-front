/**
 * Login Endpoint Service
 * Handles global API login endpoint
 */

import { axios } from "@/core/api/client";
import { apiEndpoints, buildApiUrl } from "@/config/api.config";
import type { LoginResponse } from "../types/api.types";
import type { LoginCredentials } from "../types";
import { saveToken, clearToken } from "./token.service";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Login Endpoint Service");

/**
 * Login to global API endpoint
 */
export async function loginToGlobalEndpoint(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  try {
    log.debug("Attempting global login", { email: credentials.email });

    const url = buildApiUrl(apiEndpoints.auth.loginGlobal);
    const response = await axios.post<LoginResponse>(url, {
      email: credentials.email,
      password: credentials.password,
    });

    const data = response.data;

    // Save token to storage
    if (data.data.authorization.token) {
      saveToken(data.data.authorization.token, data.data.authorization.type);
      log.info("Token saved successfully");
    }

    log.info("Global login successful");
    return data;
  } catch (error) {
    log.error("Global login failed", { data: error });
    clearToken(); // Clear any existing token on failure
    throw error;
  }
}

/**
 * Clear auth session
 */
export function clearAuthSession(): void {
  clearToken();
  log.info("Auth session cleared");
}
