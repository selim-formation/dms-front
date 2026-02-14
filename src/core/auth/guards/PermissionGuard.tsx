/**
 * PermissionGuard Component
 * Protects routes/components based on permissions
 */

import React from "react";
import { usePermissions } from "../hooks/usePermissions";
import { PermissionString } from "@/shared/types/permission.types";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: PermissionString;
  permissions?: PermissionString[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Permission Guard Component
 * Shows children only if user has required permission(s)
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { can, canAny, canAll } = usePermissions();

  // Check single permission
  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions) {
    const hasPermission = requireAll
      ? canAll(permissions)
      : canAny(permissions);

    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // User has required permission(s), render children
  return <>{children}</>;
}
