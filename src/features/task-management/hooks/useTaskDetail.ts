import { useQuery } from '@tanstack/react-query';
import { taskApiService } from '../api/taskApi';
import { taskKeys } from '../api/taskKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Lazy single-task fetch (trashed tasks can be opened). Pass `null` to stay idle. */
export function useTaskDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? taskKeys.detail(tenant, id) : ['task-management', 'detail', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return taskApiService.fetchOne(tenant, id, signal);
        },
        enabled: !!tenant && id !== null,
        staleTime: 10 * 1000,
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    return {
        task: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
