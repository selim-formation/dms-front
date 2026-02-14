/**
 * Route Guards
 * Centralized route protection logic for TanStack Router
 */

import type { RouteContext } from "../types";
import { redirect } from "@tanstack/react-router";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Route Guards");

/**
 * Auth Guard
 * Ensures user is authenticated
 */
export async function requireAuth(context: RouteContext) {
  const { auth, location } = context;

  if (!auth.isAuthenticated || !auth.user) {
    log.warn("Auth guard: User not authenticated, redirecting to login");

    throw redirect({
      to: "/$tenant/login",
      search: {
        redirect: location.pathname,
      },
    });
  }

  return { user: auth.user };
}

/**
 * Guest Guard
 * Ensures user is NOT authenticated (for login/register pages)
 */
export async function requireGuest(context: RouteContext) {
  const { auth } = context;

  if (auth?.isAuthenticated && auth?.user) {
    log.info(
      "Guest guard: User already authenticated, redirecting to dashboard",
    );

    throw redirect({
      to: "/$tenant/dashboard",
    });
  }
}

/**
 * Permission Guard
 * Ensures user has specific permission(s)
 */
export function requirePermission(permission: string | string[]) {
  return async (context: RouteContext) => {
    const { auth } = context;

    // First check auth
    await requireAuth(context);

    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = permissions.some((p) => auth.can(p));

    if (!hasPermission) {
      log.warn(
        `Permission guard: User lacks permission(s): ${permissions.join(", ")}`,
      );

      throw redirect({
        to: "/$tenant/dashboard",
        search: {
          error: "insufficient_permissions",
        },
      });
    }

    return { permissions };
  };
}

/**
 * Permission Guard (require any)
 * User must have at least one of the specified permissions
 */
export function requireAnyPermission(permissions: string[]) {
  return requirePermission(permissions);
}

/**
 * Permission Guard (require all)
 * User must have all specified permissions
 */
export function requireAllPermissions(permissions: string[]) {
  return async (context: RouteContext) => {
    const { auth } = context;

    // First check auth
    await requireAuth(context);

    const hasAllPermissions = permissions.every((p) => auth.can(p));

    if (!hasAllPermissions) {
      log.warn(
        `Permission guard: User lacks all required permissions: ${permissions.join(", ")}`,
      );

      throw redirect({
        to: "/$tenant/dashboard",
        search: {
          error: "insufficient_permissions",
        },
      });
    }

    return { permissions };
  };
}

/**
 * Tenant Guard
 * Ensures tenant is valid and loaded
 */
export async function requireTenant(context: RouteContext) {
  const { tenant } = context;

  if (!tenant?.isValid || !tenant?.current) {
    log.error("Tenant guard: Invalid or missing tenant");

    throw redirect({
      to: "/",
      search: {
        error: "invalid_tenant",
      },
    });
  }

  return { tenant: tenant.current };
}

/**
 * Combined Auth + Tenant Guard
 * Most common guard for protected routes
 */
export async function requireAuthAndTenant(context: RouteContext) {
  await requireTenant(context);
  await requireAuth(context);

  return {
    user: context.auth.user!,
    tenant: context.tenant.current!,
  };
}
