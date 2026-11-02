/**
 * useDepartmentsList — paginated, filtered departments (server cache is 30s,
 * so staleTime matches; keepPreviousData avoids flashing skeletons on paging).
 */

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { departmentKeys } from '../api/departmentKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { DepartmentFilters } from '../types/department.types';

export function useDepartmentsList(filters: DepartmentFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? departmentKeys.list(tenant, filters) : ['departments', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch departments');
            return departmentsApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        departments: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
