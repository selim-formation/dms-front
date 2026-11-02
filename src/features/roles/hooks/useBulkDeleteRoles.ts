import { useMutation } from '@tanstack/react-query';
import { rolesApiService } from '../api/rolesApi';
import { useRoleCache } from './useRoleCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

/** All-or-nothing: one system / in-use role makes the server refuse the whole call. */
export function useBulkDeleteRoles() {
    const { tenant, invalidate } = useRoleCache();

    return useMutation({
        mutationFn: (ids: number[]) => rolesApiService.bulkDelete(requireTenant(tenant), ids),
        onSettled: invalidate,
    });
}
