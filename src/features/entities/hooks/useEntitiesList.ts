import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { entityKeys } from '../api/entityKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { EntityFilters } from '../types/entity.types';

/** Paginated, filtered entities. staleTime matches the 30s server cache. */
export function useEntitiesList(filters: EntityFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? entityKeys.list(tenant, filters) : ['entities', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch entities');
            return entitiesApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        entities: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
