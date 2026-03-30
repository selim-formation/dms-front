import React, { useCallback, useMemo, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { PermissionString } from "@/shared/types/permission.types";
import type { LoginCredentials, RegisterData } from "../types";
import * as authService from "../services/auth.service";
import { resetSanctum } from "../services/sanctum.service";
import { clearTenantCookie } from "@/core/tenant/services/tenant-cookie.service";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import { apiClient } from "@/core/api/client";
import { logger } from "@/shared/utils/logger";
import { useAuthUser } from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";

const log = logger.createScoped("AuthProvider");

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { tenantId, setTenantId } = useTenant();
  const queryClient = useQueryClient();

  /**
   * Fetch user via TanStack Query
   */
  const { data, isLoading, refetch } = useAuthUser(tenantId);


  const user = data?.user ?? null;
  const permissions = data?.permissions ?? [];

  /**
   * Handle unauthorized responses globally
   */
  useEffect(() => {
    apiClient.onUnauthorized(() => {
      log.info("Unauthorized detected, clearing auth cache");

      queryClient.removeQueries({
        queryKey: ["auth"],
      });
    });
  }, [queryClient]);

  /**
   * Login
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      if (!tenantId) {
        throw new Error("Tenant ID not available");
      }

      await authService.login(tenantId, credentials);

      await refetch();

      log.info("Login successful");
    },
    [tenantId, refetch],
  );

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    if (!tenantId) return;

    try {
      await authService.logout(tenantId);
    } catch (error) {
      log.error("Logout API call failed", { data: error });
    } finally {
      queryClient.removeQueries({
        queryKey: ["auth"],
      });

      resetSanctum();
      clearTenantCookie();
      setTenantId(null);

      log.info("Logout successful");
    }
  }, [tenantId, queryClient, setTenantId]);

  /**
   * Register
   */
  const register = useCallback(
    async (data: RegisterData) => {
      if (!tenantId) {
        throw new Error("Tenant ID not available");
      }

      await authService.register(tenantId, data);

      await refetch();

      log.info("Registration successful");
    },
    [tenantId, refetch],
  );

  /**
   * Permissions helpers
   */
  const can = useCallback(
    (permission: PermissionString) => permissions.includes(permission),
    [permissions],
  );

  const canAny = useCallback(
    (requiredPermissions: PermissionString[]) =>
      requiredPermissions.some((permission) =>
        permissions.includes(permission),
      ),
    [permissions],
  );

  const canAll = useCallback(
    (requiredPermissions: PermissionString[]) =>
      requiredPermissions.every((permission) =>
        permissions.includes(permission),
      ),
    [permissions],
  );

  /**
   * Context value
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
      refetchUser: async () => { await refetch(); },
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
      refetch,
      can, canAny,
      canAll,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}