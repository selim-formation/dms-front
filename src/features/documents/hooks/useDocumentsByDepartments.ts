/**
 * useDocumentsByDepartments Hook
 * "Departments" tab — GET /documents/documents-by-departments. Mirrors
 * useDocumentsByTypes exactly (same shape, grouped by department instead).
 */

import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { DocumentsByDepartmentItem } from '../types/api.types';

const STALE_TIME = 20 * 1000;

interface UseDocumentsByDepartmentsResult {
    groups: DocumentsByDepartmentItem[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export function useDocumentsByDepartments(
    options: { enabled?: boolean } = {},
): UseDocumentsByDepartmentsResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant
            ? documentsListKeys.byDepartments(tenant)
            : ['documents-list', 'by-departments', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch documents by department');
            return documentsListApiService.fetchDocumentsByDepartments(tenant);
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
