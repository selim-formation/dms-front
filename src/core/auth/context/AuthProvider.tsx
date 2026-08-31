import React, { useCallback, useMemo, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { PermissionString } from "@/shared/types/permission.types";
import type { LoginCredentials, RegisterData } from "../types";
import type { AuthCompany } from "../types/api.types";
import * as authService from "../services/auth.service";
import { resetSanctum } from "../services/sanctum.service";
import { clearTenantCookie } from "@/core/tenant/services/tenant-cookie.service";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import { apiClient } from "@/core/api/client";
import { logger } from "@/shared/utils/logger";
import { useAuthUser } from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";

const log = logger.createScoped("AuthProvider");

// Module-level so the reference never changes across renders.
const EMPTY_PERMISSIONS: PermissionString[] = [];
const EMPTY_COMPANIES: AuthCompany[] = [];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { tenantId, setTenantId } = useTenant();
  const queryClient = useQueryClient();

  /**
   * Bootstrap session via GET /api/me — tenant-agnostic, runs on app load.
   */
  const { data, isLoading, refetch } = useAuthUser();

  const user = data?.user ?? null;
  // Stable empty-array fallbacks so a logged-out render doesn't create
  // a fresh [] every time (which would cascade into contextValue
  // recomputing and re-rendering every consumer for no reason).
  const permissions = (data?.permissions ?? EMPTY_PERMISSIONS) as PermissionString[];
  const companies = data?.companies ?? EMPTY_COMPANIES;

  /**
   * Handle unauthorized responses globally
   */
  useEffect(() => {
    apiClient.onUnauthorized(() => {
      // A guest's first /api/me bootstrap call also 401/403s — that's
      // expected, not a session expiring. Only clear cache (and thus
      // trigger a refetch) when we actually had a logged-in user, or
      // this becomes an infinite fetch -> 401 -> clear -> refetch loop.
      const hadUser = !!queryClient.getQueryData(["auth", "me"]);
      if (!hadUser) return;

      log.info("Unauthorized detected, clearing auth cache");

      queryClient.removeQueries({
        queryKey: ["auth"],
      });
    });
  }, [queryClient]);

  /**
   * Login — tenant-agnostic (POST /api/login). Resolves with the
   * companies/tenants the user can access so the caller can redirect.
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await authService.login(credentials);

      // Hydrate permissions/roles/user from /api/me right away.
      await refetch();

      log.info("Login successful");
      return result.companies;
    },
    [refetch],
  );

  /**
   * Logout — tenant-agnostic (POST /api/logout)
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      queryClient.removeQueries({
        queryKey: ["auth"],
      });

      resetSanctum();
      clearTenantCookie();
      if (tenantId) setTenantId(null);

      log.info("Logout successful");
    }
  }, [queryClient, tenantId, setTenantId]);

  /**
   * A logged-in user with zero companies has nothing to land on — every
   * tenant-scoped route requires one. Log them out immediately instead
   * of leaving a stuck, half-authenticated session.
   */
  useEffect(() => {
    if (!isLoading && user && companies.length === 0) {
      log.warn("Authenticated user has no tenant access — logging out");
      logout();
    }
  }, [isLoading, user, companies, logout]);

  /**
   * Register
   * (Still tenant-scoped — not covered by the current backend spec.)
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
      companies,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      refetchUser: async () => {
        await refetch();
      },
      can,
      canAny,
      canAll,
    }),
    [
      user,
      permissions,
      companies,
      isLoading,
      login,
      logout,
      register,
      refetch,
      can,
      canAny,
      canAll,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
