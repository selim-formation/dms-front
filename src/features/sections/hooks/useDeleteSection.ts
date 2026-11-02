/** Delete with optimistic removal from every cached list page; rolled back on error. */
import { useMutation } from '@tanstack/react-query';
import { sectionsApiService } from '../api/sectionsApi';
import { sectionKeys } from '../api/sectionKeys';
import { useSectionCache } from './useSectionCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { SectionsPaginatedData } from '../types/section.types';

export function useDeleteSection() {
    const { tenant, queryClient, invalidate } = useSectionCache();

    return useMutation({
        mutationFn: (id: number) => sectionsApiService.remove(requireTenant(tenant), id),
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: sectionKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<SectionsPaginatedData>({
                queryKey: sectionKeys.lists(tenant),
            });
            queryClient.setQueriesData<SectionsPaginatedData>(
                { queryKey: sectionKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((s) => s.id !== id),
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
