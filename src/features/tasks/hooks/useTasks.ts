/**
 * useTasks Hook
 * 
 * TanStack Query hook for fetching tasks with caching
 * Integrates with real API service and handles all data states
 * 
 * Features:
 * - Automatic caching with configurable stale time
 * - Exponential backoff retry strategy
 * - Loading, error, and data states
 * - Conditional fetching (disabled until tenant is available)
 * - Proper query key invalidation based on filters
 */

import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/taskApi';
import { taskKeys } from '../api/taskKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { Task, TaskFilters } from '../types/task.types';
import { DEFAULT_FILTERS } from '../types/task.types';

const log = logger.createScoped('useTasks');

/**
 * Configuration for query options - optimized for task list
 */
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes - tasks don't change frequently
  gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection time)
  retry: 2, // Retry twice on failure
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff max 30s
} as const;

interface UseTasksOptions {
  filters?: TaskFilters;
  enabled?: boolean;
}

interface UseTasksResult {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  isFetching: boolean;
  isStale: boolean;
}

/**
 * Hook to fetch tasks with TanStack Query
 * 
 * Usage:
 * ```tsx
 * const { tasks, isLoading, error, refetch } = useTasks();
 * const { tasks: filteredTasks } = useTasks({
 *   filters: { status: ['TODO'], priority: ['HIGH'] }
 * });
 * ```
 * 
 * @param options - Query options (filters, enabled)
 * @returns Object with tasks data, loading state, error state, and refetch function
 */
export function useTasks(options: UseTasksOptions = {}): UseTasksResult {
  const { filters = DEFAULT_FILTERS, enabled: enabledProp = true } = options;
  const tenant = useTenantId();

  // Only enable query if tenant is available
  const enabled = enabledProp && !!tenant;

  // Convert filters to Record<string, unknown> for taskKeys compatibility
  const filterRecord = filters as unknown as Record<string, unknown>;

  const query = useQuery({
    queryKey: tenant ? taskKeys.list(filterRecord) : ['tasks', 'pending'],
    queryFn: async () => {
      if (!tenant) {
        log.warn('Tenant is not available for task fetch');
        throw new Error('Tenant is required to fetch tasks');
      }
      log.info('Fetching tasks', { tenant });
      return getTasks(tenant, filters);
    },
    enabled,
    ...QUERY_CONFIG,
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isStale: query.isStale,
    error: query.error,
    refetch: query.refetch,
  };
}

