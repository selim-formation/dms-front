/** Soft delete with optimistic removal from every cached list page. */
import { useMutation } from '@tanstack/react-query';
import { typesApiService } from '../api/typesApi';
import { typeKeys } from '../api/typeKeys';
import { useTypeCache } from './useTypeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { TypesPaginatedData } from '../types/type.types';

export function useDeleteType() {
    const { tenant, queryClient, invalidate } = useTypeCache();

    return useMutation({
        mutationFn: (id: number) => typesApiService.remove(requireTenant(tenant), id),
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: typeKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<TypesPaginatedData>({
                queryKey: typeKeys.lists(tenant),
            });
            queryClient.setQueriesData<TypesPaginatedData>(
                { queryKey: typeKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((x) => x.id !== id),
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
