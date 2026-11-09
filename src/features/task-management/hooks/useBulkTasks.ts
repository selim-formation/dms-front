import { useMutation } from '@tanstack/react-query';
import { taskApiService } from '../api/taskApi';
import { useTaskCache } from './useTaskCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { TaskBulkAction } from '../types/task.types';

/** All-or-nothing: one task that can't be used makes the server refuse the whole call (422). */
export function useBulkTasks() {
    const { tenant, invalidate } = useTaskCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: TaskBulkAction; ids: number[] }) =>
            taskApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
