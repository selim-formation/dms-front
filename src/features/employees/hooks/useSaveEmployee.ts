import { useMutation } from '@tanstack/react-query';
import { employeesApiService } from '../api/employeesApi';
import { useEmployeeCache } from './useEmployeeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { EmployeePayload } from '../types/employee.types';

export function useCreateEmployee() {
    const { tenant, invalidate } = useEmployeeCache();

    return useMutation({
        mutationFn: (payload: Required<EmployeePayload>) =>
            employeesApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateEmployee() {
    const { tenant, invalidate } = useEmployeeCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: EmployeePayload }) =>
            employeesApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
