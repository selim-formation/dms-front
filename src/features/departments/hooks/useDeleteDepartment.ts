/**
 * useDeleteDepartment — soft delete with optimistic removal from every cached
 * list page; rolled back on error, resynced on settle.
 */

import { useMutation } from '@tanstack/react-query';
import { departmentsApiService } from '../api/departmentsApi';
import { departmentKeys } from '../api/departmentKeys';
import { requireTenant, useDepartmentCache } from './useDepartmentCache';
import type { DepartmentsPaginatedData } from '../types/department.types';

export function useDeleteDepartment() {
    const { tenant, queryClient, invalidate } = useDepartmentCache();

    return useMutation({
        mutationFn: (id: number) => departmentsApiService.remove(requireTenant(tenant), id),
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: departmentKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<DepartmentsPaginatedData>({
                queryKey: departmentKeys.lists(tenant),
            });
            queryClient.setQueriesData<DepartmentsPaginatedData>(
                { queryKey: departmentKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((d) => d.id !== id),
                        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
                    },
            );
            return { previous };
        },
        onError: (_error, _id, ctx) => {
            ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: invalidate,
    });
}
