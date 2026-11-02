import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { documentImportsApiService } from '../api/documentImportsApi';
import { importKeys } from '../api/importKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { LIST_POLL_MS } from '../utils/importPayload';
import type { DocumentImport, ImportFilters } from '../types/import.types';

const EMPTY: DocumentImport[] = [];

/** Always paginated. Polls every 5 s (paused automatically while the tab is hidden). */
export function useImportsList(filters: ImportFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? importKeys.list(tenant, filters) : ['document-imports', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch imports');
            return documentImportsApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        refetchInterval: LIST_POLL_MS,
        gcTime: 10 * 60 * 1000,
    });

    return {
        imports: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
