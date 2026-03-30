import { useQuery } from "@tanstack/react-query";
import { useTenantId } from "@/core/tenant/hooks/useTenant";
import { getTasks } from "../api/taskApi";
import type { TaskFilters } from "../types/task.types";
import { DEFAULT_FILTERS } from "../types/task.types";

export const useTask = (options: any = {}) => {
    const tenant = useTenantId();
    const { search = "", filters = {} } = options;

    return useQuery({
        queryKey: [
            "tasks",
            {
                tenant,
                search,
                filters,
            },
        ],

        queryFn: async () => {
            if (!tenant) return [];

            // Build proper TaskFilters object from options
            const taskFilters: TaskFilters = {
                status: filters.status || DEFAULT_FILTERS.status,
                priority: filters.priority || DEFAULT_FILTERS.priority,
                search: search || DEFAULT_FILTERS.search,
                assignee_id: filters.assignee_id ?? DEFAULT_FILTERS.assignee_id,
                task_type: filters.task_type || DEFAULT_FILTERS.task_type,
                department_id: filters.department_id ?? DEFAULT_FILTERS.department_id,
                due_date_from: filters.due_date_from || DEFAULT_FILTERS.due_date_from,
                due_date_to: filters.due_date_to || DEFAULT_FILTERS.due_date_to,
                sort_by: filters.sort_by || DEFAULT_FILTERS.sort_by,
                sort_order: filters.sort_order || DEFAULT_FILTERS.sort_order,
            };

            console.log('useTask - fetching with tenant:', tenant, 'filters:', taskFilters);

            try {
                const tasks = await getTasks(tenant, taskFilters);
                return tasks;
            } catch (error) {
                console.error('Error fetching tasks:', error);
                throw error;
            }
        },

        enabled: !!tenant,
        placeholderData: (prev) => prev,
        staleTime: 1000 * 30,
    });
};