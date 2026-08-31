/**
 * useLastPinnedDocuments Hook
 *
 * TanStack Query hook for fetching the last 5 pinned documents with caching.
 * Mirrors useLastFavorites.ts — for the home page pinned-documents widget.
 */

import { useQuery } from '@tanstack/react-query';
import { getLastPinnedDocuments } from '../api/pinnedDocuments-api';
import { pinnedDocumentsKeys } from '../api/pinnedDocumentsKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { PinnedDocumentData } from '../types/pinned.types';

const log = logger.createScoped('useLastPinnedDocuments');

const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseLastPinnedDocumentsOptions {
    enabled?: boolean;
}

interface UseLastPinnedDocumentsResult {
    pinnedDocuments: PinnedDocumentData[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
    isFetching: boolean;
    isStale: boolean;
}

export function useLastPinnedDocuments(
    options: UseLastPinnedDocumentsOptions = {}
): UseLastPinnedDocumentsResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant
            ? pinnedDocumentsKeys.last(tenant)
            : ['pinnedDocuments', 'last', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for last pinned documents fetch');
                throw new Error('Tenant is required to fetch last pinned documents');
            }

            log.info('Fetching last pinned documents', { tenant });
            return getLastPinnedDocuments(tenant);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        pinnedDocuments: Array.isArray(query.data) ? query.data : [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
        isStale: query.isStale,
    };
}
