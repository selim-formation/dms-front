/**
 * usePermissions Hook
 * Permission checking utilities
 */

import { useMemo } from "react";
import { useAuth } from "./useAuth";
import type { PermissionString } from "@/shared/types/permission.types";

interface PermissionsHook {
  /** All user permissions */
  permissions: PermissionString[];

  /** Check if user has permission */
  can: (permission: PermissionString) => boolean;

  /** Check if user has any of the permissions */
  canAny: (permissions: PermissionString[]) => boolean;

  /** Check if user has all permissions */
  canAll: (permissions: PermissionString[]) => boolean;

  /** Check if user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Hook for permission checking
 */
export function usePermissions(): PermissionsHook {
  const { permissions, can, canAny, canAll, isAuthenticated } = useAuth();

  return useMemo(
    () => ({
      permissions,
      can,
      canAny,
      canAll,
      isAuthenticated,
    }),
    [permissions, can, canAny, canAll, isAuthenticated],
  );
}

/**
 * Hook to check a specific permission
 */
export function useHasPermission(permission: PermissionString): boolean {
  const { can } = usePermissions();
  return can(permission);
}

/**
 * Hook to check multiple permissions
 */
export function useHasAnyPermission(permissions: PermissionString[]): boolean {
  const { canAny } = usePermissions();
  return canAny(permissions);
}

/**
 * Hook to check all permissions
 */
export function useHasAllPermissions(permissions: PermissionString[]): boolean {
  const { canAll } = usePermissions();
  return canAll(permissions);
}
