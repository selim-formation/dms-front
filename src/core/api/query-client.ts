/**
 * TanStack Query client configuration
 * Configured with tenant-scoped cache keys
 */

import type { QueryClient } from "@tanstack/react-query";
import { createQueryClient } from "@/shared/lib/react-query";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Query Client");

/**
 * Create and configure query client
 */
export function createAppQueryClient(): QueryClient {
  const queryClient = createQueryClient();

  // Log cache events in development
  if (import.meta.env.DEV) {
    // Subscribe to query cache updates
    const queryCache = (queryClient as any).cache;
    if (queryCache && typeof queryCache.subscribe === "function") {
      queryCache.subscribe((event: any) => {
        if (event.type === "updated") {
          log.debug("Query updated", {
            data: { queryKey: event.query?.queryKey },
          });
        }
      });
    }

    // Subscribe to mutation cache updates  
    const mutationCache = (queryClient as any).mutationCache;
    if (mutationCache && typeof mutationCache.subscribe === "function") {
      mutationCache.subscribe((event: any) => {
        if (event.type === "updated") {
          log.debug("Mutation updated", {
            data: { mutationKey: event.mutation?.options?.mutationKey },
          });
        }
      });
    }
  }

  return queryClient;
}

/**
 * Invalidate all queries for a specific tenant
 * Useful when switching tenants
 */
export async function invalidateTenantQueries(
  queryClient: QueryClient,
  tenantId: string,
): Promise<void> {
  log.info(`Invalidating queries for tenant: ${tenantId}`);

  // Invalidate all queries that include the tenant ID
  await queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey as string[];
      return queryKey.includes(tenantId);
    },
  });
}

/**
 * Clear all queries for a specific tenant
 * More aggressive than invalidate - removes from cache
 */
export function clearTenantQueries(
  queryClient: QueryClient,
  tenantId: string,
): void {
  log.info(`Clearing queries for tenant: ${tenantId}`);

  queryClient.removeQueries({
    predicate: (query) => {
      const queryKey = query.queryKey as string[];
      return queryKey.includes(tenantId);
    },
  });
}

/**
 * Clear all queries (useful on logout)
 */
export function clearAllQueries(queryClient: QueryClient): void {
  log.info("Clearing all queries");
  queryClient.clear();
}
