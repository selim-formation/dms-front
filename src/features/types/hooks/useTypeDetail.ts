import { useQuery } from '@tanstack/react-query';
import { typesApiService } from '../api/typesApi';
import { typeKeys } from '../api/typeKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Lazy single-type fetch (view dialog). Pass `null` to stay idle. */
export function useTypeDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? typeKeys.detail(tenant, id) : ['types', 'detail', 'pending'],
        queryFn: () => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return typesApiService.fetchOne(tenant, id);
        },
        enabled: !!tenant && id !== null,
        staleTime: 30 * 1000,
    });

    return {
        type: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
