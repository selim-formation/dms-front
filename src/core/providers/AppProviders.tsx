/**
 * App Providers
 * Combines all global providers in the correct order
 */

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/core/api/query-client";
import { TenantProvider } from "@/core/tenant/context/TenantProvider";
import { AuthProvider } from "@/core/auth/context/AuthProvider";
import { AuthContext } from "@/core/auth/context/AuthContext";
import { LoadingScreen } from "@/shared/components/LoadingScreen";

interface AppProvidersProps {
  children: React.ReactNode;
  initialTenantId?: string | null;
}

/**
 * Auth Loading Wrapper
 * Shows LoadingScreen while AuthProvider is validating cookies on app startup
 *
 * This component must be inside AuthProvider to access auth context
 */
function AuthLoadingWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = React.useContext(AuthContext);

  return (
    <>
      <LoadingScreen isVisible={isLoading} />
      {children}
    </>
  );
}

// Import AuthContext to check loading state is no longer needed - moved to top imports

/**
 * App Providers Component
 * Wraps the application with all necessary providers
 *
 * Provider order is important:
 * 1. QueryClientProvider - TanStack Query for data fetching
 * 2. TenantProvider - Tenant detection and validation
 * 3. AuthProvider - Authentication state (depends on tenant)
 * 4. LoadingScreen wrapper - Shows spinner while validating cookies
 */
export function AppProviders({ children, initialTenantId }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider initialTenantId={initialTenantId}>
        <AuthProvider>
          <AuthLoadingWrapper>{children}</AuthLoadingWrapper>
        </AuthProvider>
      </TenantProvider>

      {/* React Query Devtools in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

