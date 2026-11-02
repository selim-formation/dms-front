import { useQuery } from '@tanstack/react-query';
import { rolesApiService } from '../api/rolesApi';
import { roleKeys } from '../api/roleKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Lazy single-role fetch (includes `permissions`). Pass `null` to stay idle. */
export function useRoleDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? roleKeys.detail(tenant, id) : ['roles', 'detail', 'pending'],
        queryFn: () => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return rolesApiService.fetchOne(tenant, id);
        },
        enabled: !!tenant && id !== null,
        staleTime: 10 * 1000,
    });

    return {
        role: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
