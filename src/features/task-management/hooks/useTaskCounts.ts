import { useQuery } from '@tanstack/react-query';
import { taskApiService } from '../api/taskApi';
import { taskKeys } from '../api/taskKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Tab badges. Independent of search / filters (same audience as the list). */
export function useTaskCounts() {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? taskKeys.counts(tenant) : ['task-management', 'counts', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch counts');
            return taskApiService.fetchCounts(tenant, signal);
        },
        enabled: !!tenant,
        staleTime: 15 * 1000,
    });

    return { counts: query.data ?? null, isLoading: query.isLoading };
}
