import { useMutation } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { requireTenant, useDepartmentCache } from './useDepartmentCache';
import type { DepartmentBulkAction } from '../types/department.types';

export function useBulkDepartments() {
    const { tenant, invalidate } = useDepartmentCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: DepartmentBulkAction; ids: number[] }) =>
            departmentsApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
