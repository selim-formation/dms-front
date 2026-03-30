/**
 * Route Guards
 * Centralized route protection logic for TanStack Router
 * 
 * Authentication Flow:
 * - The AuthProvider validates HTTP-only cookies on mount
 * - Cookies are automatically sent by the browser with each request
 * - The backend validates cookies and returns user data if valid
 * - Route guards depend on AuthProvider's auth state
 * - Guards wait for AuthProvider to complete loading before allowing access
 */

import type { RouteContext } from "../types";
import { redirect } from "@tanstack/react-router";
import { logger } from "@/shared/utils/logger";
import { getUser } from "@/core/auth/services/auth.service";

const log = logger.createScoped("Route Guards");

/**
 * Auth Guard
 * Ensures user is authenticated via valid HTTP-only cookie
 * 
 * Depends on:
 * - AuthProvider to validate cookies on initialization
 * - Backend to confirm cookie validity
 * 
 * Waits for AuthProvider loading to complete before evaluating auth state
 */
export async function requireAuth({ context, location, params: _params }: { context: RouteContext; location: { pathname: string; search: Record<string, unknown> }; params?: unknown;[key: string]: unknown }) {
  const { tenant, queryClient } = context;

  try {
    const user = await queryClient.ensureQueryData({
      queryKey: ['me'],
      queryFn: () => getUser(tenant?.tenantId ?? ''),
    });

    if (!user) {
      throw redirect({
        to: `/login`,
        search: {
          redirect: location.pathname,
        },
      });
    }

    return { user };

  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw redirect({
        to: `/login`,
        search: {
          redirect: location.pathname,
        },
      });
    }

    throw error;
  }
}

/**
 * Guest Guard
 * Ensures user is NOT authenticated (for login/register pages)
 * 
 * Depends on:
 * - AuthProvider to validate cookies on initialization
 * 
 * Waits for AuthProvider loading to complete before evaluating auth state
 */
export async function requireGuest({ context }: { context: RouteContext;[key: string]: unknown }) {
  const { tenant, queryClient } = context;

  const user = await queryClient
    .fetchQuery({
      queryKey: ['me'],
      queryFn: () => getUser(tenant?.tenantId ?? ''),
    })
    .catch((error: unknown) => {
      if ((error as any)?.response?.status === 401) {
        return null; // 👈 guest
      }

      // throw error; // أي error تاني
    });

  if (user) {
    throw redirect({
      to: '/$tenant',
      params: { tenant: tenant?.tenantId ?? '' },
    });
  }

  // 👇 هنا طبيعي هيفتح login
}

/**
 * Permission Guard
 * Ensures user has specific permission(s)
 * 
 * Depends on:
 * - AuthProvider to validate cookies and load user permissions
 * - Backend to provide permission data in validated cookie response
 */
export function requirePermission(permission: string | string[]) {
  return async (context: RouteContext) => {
    const { auth } = context;

    // First check auth (includes loading state and cookie validation)
    await requireAuth({ context, location: context.location } as any);

    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = permissions.some((p) => auth.can(p));

    if (!hasPermission) {
      log.warn(
        `Permission guard: Authenticated user lacks permission(s): ${permissions.join(", ")}`,
      );

      throw redirect({
        to: "/$tenant/dashboard",
        params: { tenant: (context as any).context?.tenant?.tenantId ?? '' },
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
 * 
 * Depends on:
 * - AuthProvider to validate cookies and load user permissions
 */
export function requireAllPermissions(permissions: string[]) {
  return async (context: RouteContext) => {
    const { auth } = context;

    // First check auth (includes loading state and cookie validation)
    await requireAuth({ context, location: context.location } as any);

    const hasAllPermissions = permissions.every((p) => auth.can(p));

    if (!hasAllPermissions) {
      log.warn(
        `Permission guard: Authenticated user lacks all required permissions: ${permissions.join(", ")}`,
      );

      throw redirect({
        to: "/$tenant/dashboard",
        params: { tenant: (context as any).context?.tenant?.tenantId ?? '' },
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
 * 
 * Depends on:
 * - AuthProvider to validate HTTP-only cookies on initialization
 * - TenantProvider to validate tenant context
 * - Backend to confirm cookie validity and return user data
 */
export async function requireAuthAndTenant(context: RouteContext) {
  await requireTenant(context);
  await requireAuth({ context, location: context.location } as any);

  return {
    user: context.auth.user!,
    tenant: context.tenant.current!,
  };
}
