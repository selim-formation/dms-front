/** Soft delete with optimistic removal from every cached list page; rolled back on error. */
import { useMutation } from '@tanstack/react-query';
import { projectsApiService } from '../api/projectsApi';
import { projectKeys } from '../api/projectKeys';
import { useProjectCache } from './useProjectCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { ProjectsPaginatedData } from '../types/project.types';

export function useDeleteProject() {
    const { tenant, queryClient, invalidate } = useProjectCache();

    return useMutation({
        mutationFn: (id: number) => projectsApiService.remove(requireTenant(tenant), id),
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: projectKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<ProjectsPaginatedData>({
                queryKey: projectKeys.lists(tenant),
            });
            queryClient.setQueriesData<ProjectsPaginatedData>(
                { queryKey: projectKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((p) => p.id !== id),
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
