/**
 * Auth Provider
 * Manages authentication state and operations
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@/shared/types/common.types";
import { PermissionString } from "@/shared/types/permission.types";
import { LoginCredentials, RegisterData } from "../types";
import * as authService from "../services/auth.service";
import { resetSanctum } from "../services/sanctum.service";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import { apiClient } from "@/core/api/client";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("AuthProvider");

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { tenantId, isValid: isTenantValid } = useTenant();

  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<PermissionString[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user on mount and tenant change
   */
  useEffect(() => {
    if (tenantId && isTenantValid) {
      loadUser();
    } else {
      setUser(null);
      setPermissions([]);
      setIsLoading(false);
    }
  }, [tenantId, isTenantValid]);

  /**
   * Setup unauthorized callback
   */
  useEffect(() => {
    apiClient.onUnauthorized(() => {
      log.info("Unauthorized detected, clearing auth state");
      setUser(null);
      setPermissions([]);
    });
  }, []);

  /**
   * Load user and permissions
   */
  const loadUser = useCallback(async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);

      const [userData, userPermissions] = await Promise.all([
        authService.getUser(tenantId),
        authService.getUserPermissions(tenantId),
      ]);

      setUser(userData);
      setPermissions(userPermissions);

      log.info("User loaded successfully");
    } catch (error) {
      log.debug("No authenticated user");
      setUser(null);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  /**
   * Login handler
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      if (!tenantId) {
        throw new Error("Tenant ID not available");
      }

      try {
        const userData = await authService.login(tenantId, credentials);

        // Fetch permissions
        const userPermissions = await authService.getUserPermissions(tenantId);

        setUser(userData);
        setPermissions(userPermissions);

        log.info("Login successful");
      } catch (error) {
        log.error("Login failed", { data: error });
        throw error;
      }
    },
    [tenantId],
  );

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    if (!tenantId) return;

    try {
      await authService.logout(tenantId);
    } catch (error) {
      log.error("Logout API call failed", { data: error });
    } finally {
      // Clear state regardless of API call success
      setUser(null);
      setPermissions([]);
      resetSanctum();

      log.info("Logout successful");
    }
  }, [tenantId]);

  /**
   * Register handler
   */
  const register = useCallback(
    async (data: RegisterData) => {
      if (!tenantId) {
        throw new Error("Tenant ID not available");
      }

      try {
        const userData = await authService.register(tenantId, data);

        // Fetch permissions
        const userPermissions = await authService.getUserPermissions(tenantId);

        setUser(userData);
        setPermissions(userPermissions);

        log.info("Registration successful");
      } catch (error) {
        log.error("Registration failed", { data: error });
        throw error;
      }
    },
    [tenantId],
  );

  /**
   * Refetch user data
   */
  const refetchUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  /**
   * Check if user has permission
   */
  const can = useCallback(
    (permission: PermissionString): boolean => {
      return permissions.includes(permission);
    },
    [permissions],
  );

  /**
   * Check if user has any of the permissions
   */
  const canAny = useCallback(
    (requiredPermissions: PermissionString[]): boolean => {
      return requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );
    },
    [permissions],
  );

  /**
   * Check if user has all permissions
   */
  const canAll = useCallback(
    (requiredPermissions: PermissionString[]): boolean => {
      return requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );
    },
    [permissions],
  );

  /**
   * Memoized context value
   */
  const contextValue = useMemo(
    () => ({
      user,
      permissions,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      refetchUser,
      can,
      canAny,
      canAll,
    }),
    [
      user,
      permissions,
      isLoading,
      login,
      logout,
      register,
      refetchUser,
      can,
      canAny,
      canAll,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
