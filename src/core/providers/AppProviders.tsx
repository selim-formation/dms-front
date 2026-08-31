/**
 * App Providers
 * Combines all global providers in the correct order
 */

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createAppQueryClient } from "@/core/api/query-client";
import { TenantProvider } from "@/core/tenant/context/TenantProvider";
import { AuthProvider } from "@/core/auth/context/AuthProvider";
import { ThemeProvider } from "@/core/theme/ThemeProvider";

interface AppProvidersProps {
  children: React.ReactNode;
  initialTenantId?: string | null;
}

/**
 * Query client singleton
 */
const queryClient = createAppQueryClient();

/**
 * App Providers Component
 * Wraps the application with all necessary providers
 *
 * Provider order is important:
 * 1. ThemeProvider - light/dark mode, independent of tenant/auth (needed on login screen too)
 * 2. QueryClientProvider - TanStack Query for data fetching
 * 3. TenantProvider - Tenant detection and validation
 * 4. AuthProvider - Authentication state (depends on tenant)
 */
export function AppProviders({ children, initialTenantId }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TenantProvider initialTenantId={initialTenantId}>
          <AuthProvider>{children}</AuthProvider>
        </TenantProvider>

        {/* React Query Devtools in development */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

/**
 * Export query client for use in route loaders
 */
export { queryClient };
