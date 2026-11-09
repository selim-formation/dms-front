/**
 * delete / restore / force delete of one task, with optimistic removal from
 * every cached list page (each of these moves the row out of the current tab);
 * rolled back on error. Counts and details are refreshed afterwards.
 */
import { useMutation } from '@tanstack/react-query';
import { taskApiService } from '../api/taskApi';
import { taskKeys } from '../api/taskKeys';
import { useTaskCache } from './useTaskCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { TaskPaginatedData } from '../types/task.types';

export type TaskRowAction = 'delete' | 'restore' | 'force_delete';

export function useTaskRowAction(action: TaskRowAction) {
    const { tenant, queryClient, invalidate } = useTaskCache();

    return useMutation({
        mutationFn: async (id: number) => {
            const t = requireTenant(tenant);
            if (action === 'delete') await taskApiService.remove(t, id);
            else if (action === 'restore') await taskApiService.restore(t, id);
            else await taskApiService.forceDelete(t, id);
        },
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: taskKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<TaskPaginatedData>({ queryKey: taskKeys.lists(tenant) });
            queryClient.setQueriesData<TaskPaginatedData>(
                { queryKey: taskKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((t) => t.id !== id),
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
