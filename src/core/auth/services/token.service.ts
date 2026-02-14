/**
 * Token Storage Service
 * Manages authentication token persistence
 */

import { StoredAuth } from "../types/api.types";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Token Storage");

const TOKEN_STORAGE_KEY = "dms_auth_token";

/**
 * Save authentication token to storage
 */
export function saveToken(token: string, type: string = "bearer"): void {
  try {
    const authData: StoredAuth = {
      token,
      type: type as "bearer",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(authData));
    log.debug("Token saved to storage");
  } catch (error) {
    log.error("Failed to save token", { data: error });
  }
}

/**
 * Get authentication token from storage
 */
export function getToken(): string | null {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const authData: StoredAuth = JSON.parse(stored);

    // Check if token is expired
    if (authData.expiresAt && authData.expiresAt < Date.now()) {
      log.debug("Token expired");
      clearToken();
      return null;
    }

    return authData.token;
  } catch (error) {
    log.error("Failed to retrieve token", { data: error });
    return null;
  }
}

/**
 * Clear authentication token from storage
 */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    log.debug("Token cleared from storage");
  } catch (error) {
    log.error("Failed to clear token", { data: error });
  }
}

/**
 * Check if token exists
 */
export function hasToken(): boolean {
  return getToken() !== null;
}
