/**
 * useDocumentsByTypes Hook
 * "Types" tab — GET /documents/documents-by-types. Powers both the type
 * chip row (with counts) and the documents shown once a type is selected,
 * from a single fetch — no extra round-trip per chip click.
 */

import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { DocumentsByTypeItem } from '../types/api.types';

const STALE_TIME = 20 * 1000;

interface UseDocumentsByTypesResult {
    groups: DocumentsByTypeItem[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export function useDocumentsByTypes(options: { enabled?: boolean } = {}): UseDocumentsByTypesResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? documentsListKeys.byTypes(tenant) : ['documents-list', 'by-types', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch documents by type');
            return documentsListApiService.fetchDocumentsByTypes(tenant);
        },
        enabled: enabledProp && !!tenant,
        staleTime: STALE_TIME,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    return {
        groups: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
