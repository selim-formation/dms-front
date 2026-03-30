/**
 * Document Query Hooks
 * TanStack Query hooks with optimal caching and refetch strategies
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { documentApiService } from '../api/documents-grouped.api';
import { documentKeys } from '../api/documentKeys';
import { DocumentTransformer } from '../utils/document-transformer';
import type {
    GroupedDocuments,
    DepartmentGroupedDocuments,
    DocumentsByTypeApiResponse,
    DocumentsByDepartmentApiResponse,
} from '../types/api.types';

/**
 * Configuration for query options
 */
const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
    retryDelay: 1000,
} as const;

/**
 * Hook to fetch documents grouped by types (entity types)
 * Returns raw API response and transformed grouped documents
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error } = useDocumentsByTypes();
 * const groupedDocs = data?.grouped;
 * ```
 */
export function useDocumentsByTypes(): UseQueryResult<
    {
        raw: DocumentsByTypeApiResponse;
        grouped: GroupedDocuments[];
    },
    Error
> {
    const tenant = useTenantId();
    return useQuery({
        queryKey: tenant ? documentKeys.byType(tenant) : ['documents', 'by-type-pending'],
        queryFn: async () => {
            console.log('Fetching documents by types for tenant:', tenant);
            if (!tenant) throw new Error('Tenant is not available');
            const raw = await documentApiService.getDocumentsByTypes(tenant);
            const grouped = DocumentTransformer.transformByTypes(raw.data);

            return { raw, grouped };
        },
        enabled: !!tenant,
        ...QUERY_CONFIG,
    });
}

/**
 * Hook to fetch documents grouped by departments
 * Returns raw API response and transformed grouped documents
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, error } = useDocumentsByDepartments();
 * const groupedDocs = data?.grouped;
 * ```
 */
export function useDocumentsByDepartments(): UseQueryResult<
    {
        raw: DocumentsByDepartmentApiResponse;
        grouped: DepartmentGroupedDocuments[];
    },
    Error
> {
    const tenant = useTenantId();

    return useQuery({
        queryKey: tenant ? documentKeys.byDept(tenant) : ['documents', 'by-dept-pending'],
        queryFn: async () => {
            if (!tenant) throw new Error('Tenant is not available');
            const raw = await documentApiService.getDocumentsByDepartments(tenant);
            const grouped = DocumentTransformer.transformByDepartments(raw.data);
            console.log('Fetched documents by departments for tenant:', tenant, { raw, grouped });
            return { raw, grouped };
        },
        enabled: !!tenant,
        ...QUERY_CONFIG,
    });
}

/**
 * Hook to fetch a specific entity type group
 * Filters results from the full by-types query for better performance
 */
export function useDocumentsByType(entityType: string | null) {
    const { data, ...query } = useDocumentsByTypes();

    const filteredData = entityType && data?.grouped
        ? data.grouped.find((group) => group.name === entityType)
        : null;

    return {
        data: filteredData,
        ...query,
    };
}

/**
 * Hook to fetch a specific department group
 * Filters results from the full by-departments query for better performance
 */
export function useDocumentsByDepartment(departmentName: string | null) {
    const { data, ...query } = useDocumentsByDepartments();

    const filteredData = departmentName && data?.grouped
        ? data.grouped.find((group) => group.department === departmentName)
        : null;

    return {
        data: filteredData,
        ...query,
    };
}

/**
 * Hook to get a flattened list of all documents by type
 * Useful when you need all documents regardless of grouping
 */
export function useAllDocumentsByType() {
    const { data, ...query } = useDocumentsByTypes();

    const flatDocuments = data?.grouped
        ? DocumentTransformer.flattenGroupedDocuments(data.grouped)
        : [];

    return {
        data: flatDocuments,
        ...query,
    };
}

/**
 * Hook to get a flattened list of all documents by department
 * Useful when you need all documents regardless of grouping
 */
export function useAllDocumentsByDepartment() {
    const { data, ...query } = useDocumentsByDepartments();

    const flatDocuments = data?.grouped
        ? DocumentTransformer.flattenDepartmentDocuments(data.grouped)
        : [];

    return {
        data: flatDocuments,
        ...query,
    };
}
