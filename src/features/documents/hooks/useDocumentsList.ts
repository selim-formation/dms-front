/**
 * useDocumentsList Hook
 * Paginated "All Documents" tab — GET /documents.
 */

import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ApiDocument, PaginationMeta } from '../types/api.types';

// Matches the backend's own 20s per-user-per-tenant cache — no point
// treating this as fresher than the server actually keeps it.
const STALE_TIME = 20 * 1000;

interface UseDocumentsListResult {
    documents: ApiDocument[];
    meta: PaginationMeta | null;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;
}

export function useDocumentsList(page: number, options: { enabled?: boolean } = {}): UseDocumentsListResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? documentsListKeys.list(tenant, page) : ['documents-list', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch documents');
            return documentsListApiService.fetchDocuments(tenant, { page });
        },
        enabled: enabledProp && !!tenant,
        staleTime: STALE_TIME,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    return {
        documents: query.data?.documents ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
    };
}
