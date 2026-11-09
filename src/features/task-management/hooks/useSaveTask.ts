import { useMutation } from '@tanstack/react-query';
import { taskApiService } from '../api/taskApi';
import { useTaskCache } from './useTaskCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { TaskPayload } from '../types/task.types';

/** The answer is the full task: seed the detail cache with it, then refresh lists and counts. */
export function useCreateTask() {
    const { tenant, replaceTask, invalidate } = useTaskCache();

    return useMutation({
        mutationFn: (payload: TaskPayload) => taskApiService.create(requireTenant(tenant), payload),
        onSuccess: (created) => {
            replaceTask(created);
            invalidate();
        },
    });
}

export function useUpdateTask() {
    const { tenant, replaceTask, invalidate } = useTaskCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: TaskPayload }) =>
            taskApiService.update(requireTenant(tenant), id, payload),
        onSuccess: (updated) => {
            replaceTask(updated);
            invalidate();
        },
    });
}
