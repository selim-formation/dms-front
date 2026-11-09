import { useMutation } from '@tanstack/react-query';
import { taskApiService } from '../api/taskApi';
import { taskKeys } from '../api/taskKeys';
import { useTaskCache } from './useTaskCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { Task, TaskPaginatedData, TaskStatus } from '../types/task.types';

/**
 * Board / checkbox status change: the row flips at once, the server's answer replaces it,
 * a failure rolls back. Counts and tabs are refreshed afterwards (the row may leave its tab).
 */
export function useChangeTaskStatus() {
    const { tenant, queryClient, replaceTask, invalidate } = useTaskCache();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
            taskApiService.changeStatus(requireTenant(tenant), id, status),
        onMutate: async ({ id, status }) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: taskKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<TaskPaginatedData>({ queryKey: taskKeys.lists(tenant) });
            queryClient.setQueriesData<TaskPaginatedData>(
                { queryKey: taskKeys.lists(tenant) },
                (old) => old && { ...old, data: old.data.map((t: Task) => (t.id === id ? { ...t, status } : t)) },
            );
            return { previous };
        },
        onSuccess: (task) => replaceTask(task),
        onError: (_e, _v, ctx) => {
            ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: invalidate,
    });
}
