import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { employeesApiService } from '../api/employeesApi';
import { employeeKeys } from '../api/employeeKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { EmployeeFilters } from '../types/employee.types';

/** Paginated, filtered employees. staleTime matches the 30s server cache. */
export function useEmployeesList(filters: EmployeeFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? employeeKeys.list(tenant, filters) : ['employees', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch employees');
            return employeesApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        employees: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
