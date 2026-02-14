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
  const { isAuthenticated, isLoading } = useAuth();
  const { tenantId } = useTenant();

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    const dashboardPath = tenantId ? `/${tenantId}/dashboard` : "/";
    return <Navigate to={dashboardPath} />;
  }

  // User is not authenticated, render children (login/register pages)
  return <>{children}</>;
}
