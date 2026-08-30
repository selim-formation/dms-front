/**
 * useDocumentShares Hook
 *
 * TanStack Query hook for fetching paginated document shares,
 * either the ones the current user has given or received.
 */

import { useQuery } from '@tanstack/react-query';
import { getGivenShares, getReceivedShares } from '../api/documentShares-api';
import { documentSharesKeys } from '../api/documentSharesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type {
    DocumentShareData,
    DocumentShareDirection,
    DocumentSharesListParams,
    DocumentSharesMeta,
} from '../types/documentShare.types';

const log = logger.createScoped('useDocumentShares');

const QUERY_CONFIG = {
    staleTime: 2 * 60 * 1000, // 2 minutes — shares change more often than favorites
    gcTime: 15 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseDocumentSharesOptions extends DocumentSharesListParams {
    enabled?: boolean;
}

interface UseDocumentSharesResult {
    shares: DocumentShareData[];
    meta: DocumentSharesMeta | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
    isFetching: boolean;
}

/**
 * Fetch a page of document shares.
 * @param direction 'given' = shares I created, 'received' = shares granted to me
 */
export function useDocumentShares(
    direction: DocumentShareDirection,
    options: UseDocumentSharesOptions = {}
): UseDocumentSharesResult {
    const { enabled: enabledProp = true, per_page, page } = options;
    const tenant = useTenantId();
    const params: DocumentSharesListParams = { per_page, page };

    const enabled = enabledProp && !!tenant;
    const keyFn = direction === 'given' ? documentSharesKeys.givenList : documentSharesKeys.receivedList;
    const fetcher = direction === 'given' ? getGivenShares : getReceivedShares;

    const query = useQuery({
        queryKey: tenant ? keyFn(params) : ['document-shares', direction, 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for document shares fetch');
                throw new Error('Tenant is required to fetch document shares');
            }
            return fetcher(tenant, params);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        shares: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
    };
}
