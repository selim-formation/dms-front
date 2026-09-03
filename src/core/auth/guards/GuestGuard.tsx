/**
 * GuestGuard Component
 * Redirects authenticated users away from auth pages (login, register)
 */

import React from "react";
import { Navigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useTenant } from "@/core/tenant/hooks/useTenant";

interface GuestGuardProps {
  children: React.ReactNode;
}

/** Same-origin-only guard against open-redirect payloads — see route-guards.ts's twin. */
function getSafeRedirectPath(redirectTo: unknown): string | null {
  return typeof redirectTo === "string" &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
    ? redirectTo
    : null;
}

/**
 * Guest Guard Component
 * Redirects to home if user is already authenticated
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, companies } = useAuth();
  const { tenantId } = useTenant();
  // A reload on any protected page bounces through /login?redirect=<path>
  // while auth resolves — once it resolves authenticated, land back on
  // that path instead of always going to Home.
  const search = useSearch({ strict: false });
  const redirectTo = getSafeRedirectPath((search as { redirect?: unknown }).redirect);

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    if (redirectTo) {
      return <Navigate to={redirectTo} />;
    }

    const targetTenant = tenantId ?? companies[0]?.slug ?? companies[0]?.id;

    if (targetTenant) {
      return (
        <Navigate to="/$tenant" params={{ tenant: targetTenant }} />
      );
    }

    return <Navigate to="/" />;
  }

  // User is not authenticated, render children (login/register pages)
  return <>{children}</>;
}
