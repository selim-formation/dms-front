import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { managementApiService } from '../api/managementApi';
import { managementKeys } from '../api/managementKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ManagedDocument, ManagementFilters } from '../types/management.types';

const EMPTY: ManagedDocument[] = [];

/** Always paginated; responses are never cached server-side, so keep staleTime short. */
export function useManagedDocuments(filters: ManagementFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? managementKeys.list(tenant, filters) : ['document-management', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch documents');
            return managementApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        documents: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
