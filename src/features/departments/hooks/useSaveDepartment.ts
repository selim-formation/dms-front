/**
 * useCreateDepartment / useUpdateDepartment
 */

import { useMutation } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { requireTenant, useDepartmentCache } from './useDepartmentCache';
import type { DepartmentPayload } from '../types/department.types';

export function useCreateDepartment() {
    const { tenant, invalidate } = useDepartmentCache();

    return useMutation({
        mutationFn: (payload: DepartmentPayload) =>
            departmentsApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateDepartment() {
    const { tenant, invalidate } = useDepartmentCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: DepartmentPayload }) =>
            departmentsApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
