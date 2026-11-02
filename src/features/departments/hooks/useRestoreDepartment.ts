import { useMutation } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { requireTenant, useDepartmentCache } from './useDepartmentCache';

export function useRestoreDepartment() {
    const { tenant, invalidate } = useDepartmentCache();

    return useMutation({
        mutationFn: (id: number) => departmentsApiService.restore(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
