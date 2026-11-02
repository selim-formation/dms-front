import { useMutation } from '@tanstack/react-query';
import { employeesApiService } from '../api/employeesApi';
import { useEmployeeCache } from './useEmployeeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { EmployeeBulkAction } from '../types/employee.types';

export function useBulkEmployees() {
    const { tenant, invalidate } = useEmployeeCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: EmployeeBulkAction; ids: number[] }) =>
            employeesApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
