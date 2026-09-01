/**
 * useDocumentSearch Hook
 * POST /documents/search — debounces the free-text `title` term internally
 * (300ms) so callers can just pass raw input value on every keystroke.
 * Only fires once at least one filter is actually set.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { ApiDocument, DocumentSearchFilters, DocumentSearchProject } from '../types/api.types';

interface UseDocumentSearchResult {
    documents: ApiDocument[];
    projects: DocumentSearchProject[];
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;
    /** True once a search is actually active (some filter is set) — lets the page fall back to its normal tab content otherwise. */
    isActive: boolean;
}

function hasAnyFilter(filters: DocumentSearchFilters): boolean {
    return Object.values(filters).some((value) => value !== undefined && value !== '');
}

export function useDocumentSearch(filters: DocumentSearchFilters): UseDocumentSearchResult {
    const tenant = useTenantId();
    const debouncedTitle = useDebounce(filters.title ?? '', 300);

    const effectiveFilters = useMemo<DocumentSearchFilters>(
        () => ({ ...filters, title: debouncedTitle || undefined }),
        [filters, debouncedTitle],
    );

    const isActive = hasAnyFilter(effectiveFilters);

    const query = useQuery({
        queryKey: tenant
            ? documentsListKeys.search(tenant, effectiveFilters)
            : ['documents-list', 'search', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to search documents');
            return documentsListApiService.searchDocuments(tenant, effectiveFilters);
        },
        enabled: !!tenant && isActive,
        staleTime: 20 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });

    return {
        documents: query.data?.documents ?? [],
        projects: query.data?.projects ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        isActive,
    };
}
