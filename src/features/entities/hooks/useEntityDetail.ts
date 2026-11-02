import { useQuery } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { entityKeys } from '../api/entityKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Lazy single-entity fetch (view dialog). Pass `null` to stay idle. */
export function useEntityDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? entityKeys.detail(tenant, id) : ['entities', 'detail', 'pending'],
        queryFn: () => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return entitiesApiService.fetchOne(tenant, id);
        },
        enabled: !!tenant && id !== null,
        staleTime: 30 * 1000,
    });

    return {
        entity: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
