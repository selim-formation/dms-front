/**
 * useTasks Hook
 * 
 * TanStack Query hook for fetching tasks with caching
 * Handles loading, error, and data states
 * Accepts optional filters to fetch filtered task lists
 */

import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api/taskApi'
import { taskKeys } from '../api/taskKeys'
import type { TaskFilters } from '../types/task.types'
import { DEFAULT_FILTERS } from '../types/task.types'

interface UseTasksOptions {
    filters?: TaskFilters
    enabled?: boolean
}

/**
 * Fetch tasks with TanStack Query
 * 
 * Features:
 * - 5 minute stale time for cache
 * - Automatic retries (3 attempts via TanStack Query defaults)
 * - Loading, error, and data states
 * - Conditional fetching with `enabled` option
 * - Filters included in query key for cache invalidation
 */
export function useTasks(options: UseTasksOptions = {}) {
    const { filters = DEFAULT_FILTERS, enabled = true } = options

    const query = useQuery({
        queryKey: taskKeys.list(filters),
        queryFn: () => getTasks(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in older versions)
        enabled,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    })

    return {
        tasks: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    }
}
