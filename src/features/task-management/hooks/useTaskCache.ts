import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '../api/taskKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { Task, TaskPaginatedData } from '../types/task.types';

/** Any change moves tasks between tabs, so lists, counts and details refresh together. */
export function useTaskCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: taskKeys.all(tenant) });
    }, [tenant, queryClient]);

    /** Swap one task in every cached list page and the detail cache (answers of status / save calls). */
    const replaceTask = useCallback(
        (task: Task) => {
            if (!tenant) return;
            queryClient.setQueryData(taskKeys.detail(tenant, task.id), task);
            queryClient.setQueriesData<TaskPaginatedData>(
                { queryKey: taskKeys.lists(tenant) },
                (old) => old && { ...old, data: old.data.map((t) => (t.id === task.id ? task : t)) },
            );
        },
        [tenant, queryClient],
    );

    return { tenant, queryClient, invalidate, replaceTask };
}
