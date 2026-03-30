/**
 * useLastTasks Hook
 * 
 * TanStack Query hook for fetching last tasks with caching
 * Integrates with real API service and handles all data states
 * 
 * Features:
 * - Automatic caching with configurable stale time
 * - Exponential backoff retry strategy
 * - Loading, error, and data states
 * - Conditional fetching (disabled until tenant is available)
 * - Optimized re-render with proper memoization
 * - useCredentials enabled for authentication
 */

import { useQuery } from '@tanstack/react-query';
import { getLastTasks } from '../api/taskApi';
import { taskKeys } from '../api/taskKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { Task } from '../types/task.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RefetchFn = () => Promise<any>;

const log = logger.createScoped('useLastTasks');

/**
 * Configuration for query options - optimized for last tasks
 * Shorter stale time since last tasks should be more frequently updated
 */
const QUERY_CONFIG = {
    staleTime: 3 * 60 * 1000, // 3 minutes - last tasks need fresher data
    gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection time)
    retry: 2, // Retry twice on failure
    retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff max 30s
} as const;

interface UseLastTasksOptions {
    enabled?: boolean;
}

interface UseLastTasksResult {
    tasks: Task[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: RefetchFn;
    isFetching: boolean;
    isStale: boolean;
}

/**
 * Hook to fetch last tasks with TanStack Query
 * 
 * Usage:
 * ```tsx
 * const { tasks, isLoading, error, refetch } = useLastTasks();
 * ```
 * 
 * @param options - Query options (enabled)
 * @returns Object with tasks data, loading state, error state, and refetch function
 */
export function useLastTasks(
    options: UseLastTasksOptions = {}
): UseLastTasksResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    // Only enable query if tenant is available
    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? taskKeys.last() : ['tasks', 'last', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for last tasks fetch');
                throw new Error('Tenant is required to fetch last tasks');
            }

            log.info('Fetching last tasks', { tenant });
            return getLastTasks(tenant);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        tasks: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
        isStale: query.isStale,
    };
}
