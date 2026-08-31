/**
 * AuthGuard Component
 * Protects routes that require authentication
 */

import React from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Auth Guard Component
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
