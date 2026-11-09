import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { taskApiService } from '../api/taskApi';
import { taskKeys } from '../api/taskKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { Task, TaskFilters } from '../types/task.types';

const EMPTY: Task[] = [];

/** Always paginated; responses are never cached server-side, so keep staleTime short. */
export function useTaskList(filters: TaskFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? taskKeys.list(tenant, filters) : ['task-management', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch tasks');
            return taskApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        tasks: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
