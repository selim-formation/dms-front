/**
 * GuestGuard Component
 * Redirects authenticated users away from auth pages (login, register)
 */

import React from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useTenant } from "@/core/tenant/hooks/useTenant";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * Guest Guard Component
 * Redirects to dashboard if user is already authenticated
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, companies } = useAuth();
  const { tenantId } = useTenant();

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    const targetTenant = tenantId ?? companies[0]?.slug ?? companies[0]?.id;

    if (targetTenant) {
      return (
        <Navigate to="/$tenant/dashboard" params={{ tenant: targetTenant }} />
      );
    }

    return <Navigate to="/" />;
  }

  // User is not authenticated, render children (login/register pages)
  return <>{children}</>;
}
