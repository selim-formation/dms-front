import { useMutation } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { requireTenant, useDepartmentCache } from './useDepartmentCache';

/** Permanent delete (also removes the department's sections server-side). */
export function useForceDeleteDepartment() {
    const { tenant, invalidate } = useDepartmentCache();

    return useMutation({
        mutationFn: (id: number) => departmentsApiService.forceDelete(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
