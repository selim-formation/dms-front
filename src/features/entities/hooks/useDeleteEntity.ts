/** Soft delete with optimistic removal from every cached list page. */
import { useMutation } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { entityKeys } from '../api/entityKeys';
import { useEntityCache } from './useEntityCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { EntitiesPaginatedData } from '../types/entity.types';

export function useDeleteEntity() {
    const { tenant, queryClient, invalidate } = useEntityCache();

    return useMutation({
        mutationFn: (id: number) => entitiesApiService.remove(requireTenant(tenant), id),
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: entityKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<EntitiesPaginatedData>({
                queryKey: entityKeys.lists(tenant),
            });
            queryClient.setQueriesData<EntitiesPaginatedData>(
                { queryKey: entityKeys.lists(tenant) },
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
