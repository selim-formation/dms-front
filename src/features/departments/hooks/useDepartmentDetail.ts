import { useQuery } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { departmentKeys } from '../api/departmentKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Lazy single-department fetch (view dialog). Pass `null` to stay idle. */
export function useDepartmentDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey:
            tenant && id !== null
                ? departmentKeys.detail(tenant, id)
                : ['departments', 'detail', 'pending'],
        queryFn: () => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return departmentsApiService.fetchOne(tenant, id);
        },
        enabled: !!tenant && id !== null,
        staleTime: 30 * 1000,
    });

    return {
        department: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
