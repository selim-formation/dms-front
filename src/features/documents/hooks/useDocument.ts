/**
 * useDocument Hook
 * TanStack Query hook for fetching a single document with full details
 *
 * Features:
 * - Automatic request caching and deduplication
 * - Type-safe query keys
 * - Request cancellation on unmount
 * - Handles permission and not-found errors
 * - Optimized stale-time and garbage collection
 */

import { useQuery } from '@tanstack/react-query';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { documentViewApiService } from '../api/documentView.api';
import { documentKeys } from '../api/documentKeys';
import type { DocumentViewData } from '../types/api.types';

/**
 * Query configuration for optimized caching and refetching behavior
 */
const QUERY_CONFIG = {
    // How long data is fresh until it becomes stale (10 minutes for document view)
    staleTime: 10 * 60 * 1000,

    // How long to keep cached data before garbage collection (30 minutes)
    gcTime: 30 * 60 * 1000,

    // Retry failed requests once with 1 second delay
    retry: 1,
    retryDelay: 1000,

    // Don't refetch when window regains focus for document view
    refetchOnWindowFocus: false,

    // Don't refetch on mount if data exists and is fresh
    refetchOnMount: false,
} as const;

/**
 * Hook to fetch detailed document information via the view endpoint
 *
 * @param documentId - The ID of the document to fetch
 * @param options - Optional query options to override defaults
 * @returns Query result with document data, loading state, and error information
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data: document, isLoading, error } = useDocument(1);
 *
 * // With disabled initial fetch
 * const { data: document, isLoading } = useDocument(1, {
 *   enabled: false // Fetch later manually
 * });
 *
 * // Accessing document data
 * if (document) {
 *   console.log(document.title);
 *   console.log(document.version_history);
 *   console.log(document.document_activities);
 * }
 * ```
 */
export function useDocument(
    documentId: number,
    options?: {
        enabled?: boolean;
    },
) {
    const tenant = useTenantId();

    return useQuery<DocumentViewData, Error>({
        queryKey: tenant ? documentKeys.view(tenant, documentId) : ['document-view-pending'],
        queryFn: async ({ signal }) => {
            if (!tenant) {
                throw new Error('Tenant ID is required to fetch document');
            }

            console.log(`[useDocument] Fetching document ${documentId} for tenant: ${tenant}`);

            const response = await documentViewApiService.getDocumentView(tenant, documentId, signal);

            console.log(`[useDocument] Successfully fetched document ${documentId}`, {
                title: response.title,
                version: response.version,
            });

            return response;
        },
        enabled: !!tenant && !!documentId && (options?.enabled !== false),
        staleTime: QUERY_CONFIG.staleTime,
        gcTime: QUERY_CONFIG.gcTime,
        retry: QUERY_CONFIG.retry,
        retryDelay: QUERY_CONFIG.retryDelay,
        refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
        refetchOnMount: QUERY_CONFIG.refetchOnMount,
    });
}

/**
 * Alternative hook name for better semantics (useDocument reads better for singular document)
 * Export both for flexibility
 */
export const useDocumentView = useDocument;
