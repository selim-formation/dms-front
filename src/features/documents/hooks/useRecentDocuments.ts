/**
 * useRecentDocuments Hook
 * GET /documents/recent — dashboard widget, last N recently-CREATED
 * approved+visible docs. Returns RecentApiDocument (slimmer shape than
 * ApiDocument) — see documentsListApi.fetchRecent.
 */

import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { RecentApiDocument } from '../types/api.types';

interface UseRecentDocumentsOptions {
    limit?: number;
    enabled?: boolean;
}

interface UseRecentDocumentsResult {
    documents: RecentApiDocument[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
}

export function useRecentDocuments(
    options: UseRecentDocumentsOptions = {},
): UseRecentDocumentsResult {
    const { limit, enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? documentsListKeys.recent(tenant, limit) : ['documents-list', 'recent', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch recent documents');
            return documentsListApiService.fetchRecent(tenant, limit);
        },
        enabled: enabledProp && !!tenant,
        staleTime: 20 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    return {
        documents: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
