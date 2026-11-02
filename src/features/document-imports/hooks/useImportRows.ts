import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { documentImportsApiService } from '../api/documentImportsApi';
import { importKeys } from '../api/importKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { LIST_POLL_MS } from '../utils/importPayload';
import type { ImportRow, RowFilters } from '../types/import.types';

const EMPTY: ImportRow[] = [];

/**
 * Rows found in the archive. `importStatus` is part of the key, so a status
 * change refetches; `live` polls while the server is still working.
 */
export function useImportRows(id: number, filters: RowFilters, importStatus: string, live: boolean) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? importKeys.rows(tenant, id, filters, importStatus) : ['document-imports', 'rows', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch rows');
            return documentImportsApiService.fetchRows(tenant, id, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        refetchInterval: live ? LIST_POLL_MS : false,
    });

    return {
        rows: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
    };
}
