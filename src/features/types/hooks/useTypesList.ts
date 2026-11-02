import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { typesApiService } from '../api/typesApi';
import { typeKeys } from '../api/typeKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { TypeFilters } from '../types/type.types';

/** Paginated, filtered types. staleTime matches the 30s server cache. */
export function useTypesList(filters: TypeFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? typeKeys.list(tenant, filters) : ['types', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch types');
            return typesApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        types: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
