/**
 * useDocumentFiltering - Filtering Logic Hook
 * Orchestrates filtering service with memoization
 */

import { useMemo } from 'react';
import type { UIDocument } from '@/features/documents/types/api.types';
import { DocumentFilterService } from '../services/documentFilter.service';
import { DocumentAdapter } from '../adapters/documentAdapter';
import type { FilterCriteria } from '../services/documentFilter.service';

interface UseDocumentFilteringParams {
    documents: UIDocument[];
    searchQuery: string;
    filters: FilterCriteria;
    enabled?: boolean;
}

export function useDocumentFiltering({
    documents,
    searchQuery,
    filters,
    enabled = true,
}: UseDocumentFilteringParams) {
    const filteredDocuments = useMemo(() => {
        if (!enabled) return [];

        const result = DocumentFilterService.applyAllFilters(
            documents,
            searchQuery,
            filters
        );

        return DocumentAdapter.fromUIDocumentsToGrid(result);
    }, [documents, searchQuery, filters, enabled]);

    return {
        filteredDocuments,
        count: filteredDocuments.length,
    };
}
