import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { storageApiService } from '../api/storageApi';
import { storageKeys } from '../api/storageKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { StorageConnection, StorageFilters } from '../types/storage.types';

const EMPTY: StorageConnection[] = [];

/** Always paginated; responses are never cached server-side, so keep staleTime short. */
export function useStorageList(filters: StorageFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? storageKeys.list(tenant, filters) : ['storage-connections', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch storage connections');
            return storageApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        connections: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
