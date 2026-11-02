/** Soft delete with optimistic removal from every cached list page; rolled back on error. */
import { useMutation } from '@tanstack/react-query';
import { employeesApiService } from '../api/employeesApi';
import { employeeKeys } from '../api/employeeKeys';
import { useEmployeeCache } from './useEmployeeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { EmployeesPaginatedData } from '../types/employee.types';

export function useDeleteEmployee() {
    const { tenant, queryClient, invalidate } = useEmployeeCache();

    return useMutation({
        mutationFn: (id: number) => employeesApiService.remove(requireTenant(tenant), id),
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: employeeKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<EmployeesPaginatedData>({
                queryKey: employeeKeys.lists(tenant),
            });
            queryClient.setQueriesData<EmployeesPaginatedData>(
                { queryKey: employeeKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((e) => e.id !== id),
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
