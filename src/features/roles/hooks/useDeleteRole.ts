/** Delete with optimistic removal from every cached list page; rolled back on error. */
import { useMutation } from '@tanstack/react-query';
import { rolesApiService } from '../api/rolesApi';
import { roleKeys } from '../api/roleKeys';
import { useRoleCache } from './useRoleCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { RolesPaginatedData } from '../types/role.types';

export function useDeleteRole() {
    const { tenant, queryClient, invalidate } = useRoleCache();

    return useMutation({
        mutationFn: (id: number) => rolesApiService.remove(requireTenant(tenant), id),
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: roleKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<RolesPaginatedData>({
                queryKey: roleKeys.lists(tenant),
            });
            queryClient.setQueriesData<RolesPaginatedData>(
                { queryKey: roleKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((r) => r.id !== id),
                        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
                    },
            );
            return { previous };
        },
        onError: (_e, _id, ctx) => {
            ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: invalidate,
    });
}
