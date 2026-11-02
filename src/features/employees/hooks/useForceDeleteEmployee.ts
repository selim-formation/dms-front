import { useMutation } from '@tanstack/react-query';
import { employeesApiService } from '../api/employeesApi';
import { useEmployeeCache } from './useEmployeeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

/** Permanent delete — cannot be undone. */
export function useForceDeleteEmployee() {
    const { tenant, invalidate } = useEmployeeCache();

    return useMutation({
        mutationFn: (id: number) => employeesApiService.forceDelete(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
