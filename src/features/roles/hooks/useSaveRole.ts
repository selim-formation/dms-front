import { useMutation } from '@tanstack/react-query';
import { rolesApiService } from '../api/rolesApi';
import { useRoleCache } from './useRoleCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { RolePayload } from '../types/role.types';

export function useCreateRole() {
    const { tenant, invalidate } = useRoleCache();

    return useMutation({
        mutationFn: (payload: RolePayload) => rolesApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateRole() {
    const { tenant, invalidate } = useRoleCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: RolePayload }) =>
            rolesApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
