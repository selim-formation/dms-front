import { useQuery } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { departmentKeys } from '../api/departmentKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

export function useDepartmentStats() {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? departmentKeys.stats(tenant) : ['departments', 'stats', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch department stats');
            return departmentsApiService.fetchStats(tenant);
        },
        enabled: !!tenant,
        staleTime: 30 * 1000,
    });

    return { stats: query.data ?? null, isLoading: query.isLoading };
}
