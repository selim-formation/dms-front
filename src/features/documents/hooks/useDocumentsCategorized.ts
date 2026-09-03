/**
 * useDocumentsCategorized Hook
 * POST /documents/categorized — server-side filter by category/department/
 * has_expire_date, grouped by type. Backs the Advanced Filters sidebar
 * (type/importance are refined client-side afterward — see DocumentListPage).
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { CategorizedFilters, CategorizedGroup } from '../types/api.types';

const STALE_TIME = 20 * 1000;

interface UseDocumentsCategorizedResult {
    groups: CategorizedGroup[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export function useDocumentsCategorized(
    filters: CategorizedFilters,
    options: { enabled?: boolean } = {},
): UseDocumentsCategorizedResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    // Stable reference so the query key (and refetch) only changes when a
    // filter value actually changes, not on every parent render.
    const stableFilters = useMemo(
        () => filters,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters.category, filters.entity, filters.department, filters.has_expire_date],
    );

    const query = useQuery({
        queryKey: tenant
            ? documentsListKeys.categorized(tenant, stableFilters)
            : ['documents-list', 'categorized', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch categorized documents');
            return documentsListApiService.fetchCategorized(tenant, stableFilters);
        },
        enabled: enabledProp && !!tenant,
        staleTime: STALE_TIME,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    return {
        groups: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
