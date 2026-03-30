/**
 * useDocumentSearch Hook
 *
 * TanStack Query hook for searching documents via POST /{tenant}/documents/search.
 * Accepts all filter params from the API spec and caches results per unique
 * combination of filters.
 */

import { useQuery } from '@tanstack/react-query';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { documentsSearchApiService } from '../api/documents-search';
import { documentKeys } from '../api/documentKeys';
import { logger } from '@/shared/utils/logger';
import type {
    DocumentSearchParams,
    UseDocumentSearchResult,
} from '../types/search.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RefetchFn = () => Promise<any>;

const log = logger.createScoped('useDocumentSearch');

const QUERY_CONFIG = {
    staleTime: 2 * 60 * 1000,        // 2 minutes - search results go stale quickly
    gcTime: 10 * 60 * 1000,          // 10 minutes
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
} as const;

interface UseDocumentSearchOptions {
    params?: DocumentSearchParams;
    /** Set to false to disable the query. Defaults to true. */
    enabled?: boolean;
}

/**
 * Custom hook for searching documents with filters.
 *
 * Usage:
 * ```tsx
 * const { documents, projects, isLoading, error } = useDocumentSearch({
 *   params: { title: 'contract', importance: 'High' },
 * });
 * ```
 */
export function useDocumentSearch(
    options: UseDocumentSearchOptions = {},
): UseDocumentSearchResult {
    const { params = {}, enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant
            ? documentKeys.search(tenant, params as Record<string, unknown>)
            : ['documents', 'search', 'pending'],
        queryFn: async ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to search documents');

            log.info('Searching documents', { tenant, params });

            const response = await documentsSearchApiService.searchDocuments(tenant, params, signal);

            log.info('Search completed', {
                documentCount: response.data.documents.length,
                projectCount: response.data.projects.length,
            });

            return response.data;
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        documents: query.data?.documents ?? [],
        projects: query.data?.projects ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        isFetching: query.isFetching,
        refetch: query.refetch as RefetchFn,
    };
}
