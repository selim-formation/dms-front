/**
 * usePinnedDocuments Hook
 * 
 * TanStack Query hook for fetching all pinned documents with caching
 * Integrates with API service and handles all data states
 */

import { useQuery } from '@tanstack/react-query';
import { getPinnedDocuments } from '../api/pinnedDocuments-api';
import { pinnedDocumentsKeys } from '../api/pinnedDocumentsKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { PinnedDocumentData } from '../types/pinned.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RefetchFn = () => Promise<any>;

const log = logger.createScoped('usePinnedDocuments');

/**
 * Configuration for query options
 */
const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UsePinnedDocumentsOptions {
    enabled?: boolean;
}

interface UsePinnedDocumentsResult {
    pinnedDocuments: PinnedDocumentData[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: RefetchFn;
    isFetching: boolean;
    isStale: boolean;
}

/**
 * Hook to fetch all pinned documents
 * 
 * Features:
 * - TanStack Query caching with 5 minute stale time
 * - Exponential backoff retry strategy
 * - Conditional fetching (disabled until tenant is available)
 * - Proper loading, error, and data states
 * 
 * @param options - Query options
 * @returns Object with pinned documents data and state
 */
export function usePinnedDocuments(
    options: UsePinnedDocumentsOptions = {}
): UsePinnedDocumentsResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant
            ? pinnedDocumentsKeys.list()
            : ['pinnedDocuments', 'list', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for pinned documents fetch');
                throw new Error('Tenant is required to fetch pinned documents');
            }

            log.info('Fetching pinned documents', { tenant });
            return getPinnedDocuments(tenant);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        pinnedDocuments: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
        isStale: query.isStale,
    };
}
