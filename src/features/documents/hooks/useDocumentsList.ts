/**
 * useDocumentsList Hook
 * TanStack Query hook for fetching paginated documents with optimized caching
 * 
 * Features:
 * - Automatic request caching and deduplication
 * - Pagination support
 * - Filtering and sorting
 * - Automatic stale-time based refetching
 * - Request cancellation on unmount
 * - Type-safe query keys
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { documentListApiService } from '../api/documents-list.api';
import { documentKeys } from '../api/documentKeys';
import type { DocumentListParams, DocumentListData } from '../types/api.types';

/**
 * Query configuration for optimized caching and refetching behavior
 */
const QUERY_CONFIG = {
    // How long data is fresh until it becomes stale (5 minutes)
    staleTime: 5 * 60 * 1000,

    // How long to keep cached data before garbage collection (30 minutes)
    gcTime: 30 * 60 * 1000,

    // Retry failed requests once with 1 second delay
    retry: 1,
    retryDelay: 1000,

    // Refetch when window regains focus (good for SPA)
    refetchOnWindowFocus: false,

    // Don't refetch on mount if data exists and is fresh
    refetchOnMount: false,
} as const;

/**
 * Hook to fetch paginated documents list
 * 
 * @param params - Query parameters (page, per_page, sort, filters)
 * @param options - Optional query options to override defaults
 * @returns Query result with documents data
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useDocumentsList({
 *   page: 1,
 *   per_page: 15
 * });
 * 
 * // With filtering
 * const { data, isLoading } = useDocumentsList({
 *   page: 1,
 *   per_page: 15,
 *   search: 'budget',
 *   importance: 'high',
 *   sort_by: 'created_at',
 *   sort_dir: 'desc'
 * });
 * 
 * // Accessing data
 * const documents = data?.data || [];
 * const currentPage = data?.meta.current_page;
 * const totalPages = data?.meta.last_page;
 * ```
 */
export function useDocumentsList(
    params?: DocumentListParams,
    options?: {
        enabled?: boolean;
    },
) {
    const tenant = useTenantId();

    return useQuery<DocumentListData, Error>({
        queryKey: tenant ? documentKeys.paginatedList(tenant, params) : ['documents-list-pending'],
        queryFn: async ({ signal }) => {
            if (!tenant) {
                throw new Error('Tenant ID is required to fetch documents');
            }

            console.log(`[useDocumentsList] Fetching documents for tenant: ${tenant}`, { params });

            const response = await documentListApiService.getDocuments(tenant, params, signal);

            console.log(`[useDocumentsList] Successfully fetched documents`, {
                count: response.data.length,
                page: response.meta.current_page,
                total: response.meta.total,
            });

            return response;
        },
        enabled: !!tenant && (options?.enabled !== false),
        staleTime: QUERY_CONFIG.staleTime,
        gcTime: QUERY_CONFIG.gcTime,
        retry: QUERY_CONFIG.retry,
        retryDelay: QUERY_CONFIG.retryDelay,
        refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
        refetchOnMount: QUERY_CONFIG.refetchOnMount,
    });
}

/**
 * Hook to fetch a single page of documents with pagination helpers
 * Simplifies pagination logic in components
 * 
 * @param page - Page number (1-indexed)
 * @param perPage - Items per page
 * @param options - Additional query options
 * @returns Query result with pagination helpers
 * 
 * @example
 * ```tsx
 * const { documents, goToPage, goToNextPage, goToPrevPage } =
 *   useDocumentsPage(1, 15);
 * 
 * return (
 *   <>
 *     {documents.map(doc => <DocumentRow key={doc.id} {...doc} />)}
 *     <button onClick={() => goToNextPage()}>Next</button>
 *     <button onClick={() => goToPrevPage()}>Previous</button>
 *   </>
 * );
 * ```
 */
export function useDocumentsPage(
    page: number = 1,
    perPage: number = 15,
    filters?: DocumentListParams,
) {
    const queryClient = useQueryClient();
    const tenant = useTenantId();

    const query = useDocumentsList({
        page,
        per_page: perPage,
        ...filters,
    });

    return {
        ...query,
        documents: query.data?.data || [],
        pagination: query.data?.meta,
        goToPage: (pageNum: number) => {
            if (tenant) {
                queryClient.setQueryData(
                    documentKeys.paginatedList(tenant, { page: pageNum, per_page: perPage, ...filters }),
                    (oldData) => oldData,
                );
            }
        },
        goToNextPage: () => {
            const meta = query.data?.meta;
            if (meta && meta.current_page < meta.last_page && tenant) {
                queryClient.refetchQueries({
                    queryKey: documentKeys.paginatedList(tenant, {
                        page: meta.current_page + 1,
                        per_page: perPage,
                        ...filters,
                    }),
                });
            }
        },
        goToPrevPage: () => {
            const meta = query.data?.meta;
            if (meta && meta.current_page > 1 && tenant) {
                queryClient.refetchQueries({
                    queryKey: documentKeys.paginatedList(tenant, {
                        page: meta.current_page - 1,
                        per_page: perPage,
                        ...filters,
                    }),
                });
            }
        },
        hasNextPage: (): boolean => {
            const meta = query.data?.meta;
            return !!(meta && meta.current_page < meta.last_page);
        },
        hasPrevPage: (): boolean => {
            const meta = query.data?.meta;
            return !!(meta && meta.current_page > 1);
        },
        refresh: () => {
            if (tenant) {
                queryClient.refetchQueries({
                    queryKey: documentKeys.paginatedList(tenant, { page, per_page: perPage, ...filters }),
                });
            }
        },
        clearCache: () => {
            if (tenant) {
                queryClient.removeQueries({
                    queryKey: documentKeys.lists(tenant),
                });
            }
        },
    };
}

/**
 * Hook to search documents with pagination
 * Automatically manages search queries with caching
 * 
 * @param searchQuery - Search string (debounce in component if needed)
 * @param page - Page number
 * @param perPage - Items per page
 * @returns Query result with search results
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const { documents, isLoading } = useDocumentsSearch(searchTerm, 1, 15);
 * 
 * return (
 *   <>
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search documents..."
 *     />
 *     {isLoading && <p>Searching...</p>}
 *     {documents.map(doc => <DocumentRow key={doc.id} {...doc} />)}
 *   </>
 * );
 * ```
 */
export function useDocumentsSearch(
    searchQuery: string,
    page: number = 1,
    perPage: number = 15,
) {
    const query = useDocumentsList(
        {
            page,
            per_page: perPage,
            search: searchQuery,
        },
        {
            // When search query is empty, disable the query
            enabled: searchQuery.length > 0,
        },
    );

    return {
        ...query,
        documents: query.data?.data || [],
        totalResults: query.data?.meta.total || 0,
    };
}

/**
 * Hook to filter documents by specific criteria
 * Provides type-safe filtering with caching
 * 
 * @param filters - Filter criteria (importance, category, department, etc.)
 * @returns Query result with filtered documents
 * 
 * @example
 * ```tsx
 * const { documents, isLoading } = useDocumentsFilter({
 *   importance: 'critical',
 *   department: 1,
 *   sort_by: 'updated_at',
 *   sort_dir: 'desc'
 * });
 * ```
 */
export function useDocumentsFilter(filters: DocumentListParams) {
    const query = useDocumentsList({
        page: 1,
        per_page: 50, // Fetch more for filtered results
        ...filters,
    });

    return {
        ...query,
        documents: query.data?.data || [],
    };
}

/**
 * Hook to invalidate and refetch documents cache
 * Useful after mutations (create, update, delete)
 * 
 * @returns Object with invalidation functions
 * 
 * @example
 * ```tsx
 * const mutation = useMutation({
 *   mutationFn: updateDocument,
 *   onSuccess: () => {
 *     invalidateDocuments.all(); // Clear all document queries
 *   }
 * });
 * ```
 */
export function useInvalidateDocuments() {
    const queryClient = useQueryClient();
    const tenant = useTenantId();

    return {
        // Invalidate all document queries for current tenant
        all: () => {
            if (tenant) {
                return queryClient.invalidateQueries({
                    queryKey: documentKeys.all(tenant),
                });
            }
        },

        // Invalidate only list queries
        lists: () => {
            if (tenant) {
                return queryClient.invalidateQueries({
                    queryKey: documentKeys.lists(tenant),
                });
            }
        },

        // Invalidate a specific document
        detail: (documentId: number) => {
            if (tenant) {
                return queryClient.invalidateQueries({
                    queryKey: documentKeys.detail(tenant, documentId),
                });
            }
        },

        // Soft refresh (don't reset to loading state)
        softRefresh: () => {
            if (tenant) {
                return queryClient.refetchQueries({
                    queryKey: documentKeys.lists(tenant),
                });
            }
        },
    };
}
