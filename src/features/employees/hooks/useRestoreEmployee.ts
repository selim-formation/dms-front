import { useMutation } from '@tanstack/react-query';
import { employeesApiService } from '../api/employeesApi';
import { useEmployeeCache } from './useEmployeeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

export function useRestoreEmployee() {
    const { tenant, invalidate } = useEmployeeCache();

    return useMutation({
        mutationFn: (id: number) => employeesApiService.restore(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
