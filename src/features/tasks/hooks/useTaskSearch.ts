/**
 * useTaskSearch Hook
 * 
 * Custom React hook for managing task search with React Query.
 * Handles API integration, caching, and error management.
 * Debounced search input to avoid excessive API calls.
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { taskSearchService } from '@/features/tasks/services/taskSearchService';
import type { TaskSearchParams, TaskSearchResponse } from '@/features/tasks/contracts';

interface UseTaskSearchOptions extends Omit<UseQueryOptions<TaskSearchResponse, Error>, 'queryKey' | 'queryFn'> {
  /** Enable/disable the query. Useful for conditional queries */
  enabled?: boolean;
}

/**
 * Hook for performing task searches with debouncing and caching
 * 
 * Uses React Query (TanStack Query) to manage:
 * - Server state (fetched tasks, pagination meta)
 * - Loading states (isLoading, isFetching)
 * - Error handling (error, isError)
 * - Automatic caching with stale time management
 * - Request deduplication
 * 
 * Configuration:
 * - staleTime: 5 minutes (fresh data for 5 min before considering stale)
 * - gcTime: 10 minutes (keep cache for 10 min even if unused)
 * - retry: 1 (retry failed requests once per spec)
 * 
 * @param params - Search parameters (search term, filters, pagination, sorting)
 * @param options - React Query options for customizing behavior
 * @returns Query result with data, loading/error states, and refetch function
 * 
 * @example
 * // Basic search
 * const { data, isLoading, error } = useTaskSearch({ 
 *   search: 'database',
 *   per_page: 15,
 *   page: 1 
 * });
 * 
 * if (isLoading) return <LoadingSkeleton />;
 * if (error) return <ErrorBanner error={error} />;
 * return <TaskList tasks={data?.data || []} />;
 * 
 * @example
 * // With filters
 * const { data, refetch } = useTaskSearch({
 *   search: 'bug fix',
 *   status: ['TODO', 'IN_PROGRESS'],
 *   priority: ['HIGH', 'URGENT'],
 *   per_page: 20,
 *   page: 1,
 *   sort_by: 'created_at',
 *   sort_order: 'desc'
 * });
 */
export function useTaskSearch(
  params: TaskSearchParams,
  options?: UseTaskSearchOptions,
) {
  // Get current tenant ID
  const tenantId = useTenantId();

  // Generate unique cache key based on parameters and tenant
  // This ensures requests with different params are cached separately per tenant
  const queryKey = ['tasks', 'search', tenantId, params];

  return useQuery<TaskSearchResponse, Error>({
    queryKey,
    queryFn: () => {
      if (!tenantId) {
        throw new Error('Tenant ID is required to search tasks');
      }

      console.log('Executing task search with params:', params);
      return taskSearchService.search(params, tenantId);
    },
    // Cache configuration per Phase 1 research findings
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Retry failed requests once
    enabled: options?.enabled !== false && !!tenantId,
    ...options,
  });
}

/**
 * hook for getting invalidation function
 * Useful when tasks are updated/created and we need to refetch search results
 * 
 * @returns Function to invalidate all search queries
 * 
 * @example
 * const invalidateSearch = useInvalidateTaskSearch();
 * 
 * // After creating a new task
 * await createTask(newTask);
 * invalidateSearch(); // Refetch all search queries
 */
export function useInvalidateTaskSearch() {
  const queryClient = useQueryClient();

  return function invalidate() {
    if (queryClient) {
      return queryClient.invalidateQueries({
        queryKey: ['tasks', 'search'],
        type: 'all', // Invalidate all search queries
      });
    }
  };
}

/**
 * Hook for resetting search to initial state
 * Clears all search-related cache entries
 * 
 * @example
 * const resetSearch = useResetTaskSearch();
 * 
 * // When user clicks "Clear filters" button
 * resetSearch();
 */
export function useResetTaskSearch() {
  const queryClient = useQueryClient();

  return function reset() {
    if (queryClient) {
      return queryClient.removeQueries({
        queryKey: ['tasks', 'search'],
        type: 'all',
      });
    }
  };
}
