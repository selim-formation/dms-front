/**
 * Task API Functions
 *
 * GET /{tenant}/tasks — real API integration.
 * Note: the backend ignores query-string filters (verified: `?status=TODO`
 * still returns every status) — filtering stays client-side, same as
 * when this called mock data.
 */

import { apiClient } from "@/core/api/client";
import { apiEndpoints, buildApiUrl } from "@/config/api.config";
import { logger } from "@/shared/utils/logger";
import { normalizeTasks } from "../utils/normalizeTask";
import { filterTasks } from "../utils/taskFilters";
import type { Task, TaskFilters, TasksApiResponse } from "../types/task.types";
import { DEFAULT_FILTERS } from "../types/task.types";

const log = logger.createScoped("taskApi");

/**
 * Fetch tasks for a tenant, applying filters client-side.
 */
export async function getTasks(
  tenant: string,
  filters: TaskFilters = DEFAULT_FILTERS,
): Promise<Task[]> {
  try {
    const url = buildApiUrl(apiEndpoints.tasks.list, { tenant });
    const response = await apiClient.getInstance().get<TasksApiResponse>(url);

    const tasks = normalizeTasks(response.data.data ?? []);
    return filterTasks(tasks, filters);
  } catch (error) {
    log.error("Failed to fetch tasks", { tenant, error });
    throw error;
  }
}

/**
 * Fetch a single task by id. GET /{tenant}/tasks/{id} 404s on this
 * backend today, so this resolves from the list fetch instead.
 */
export async function getTaskById(
  tenant: string,
  id: number,
): Promise<Task | null> {
  const tasks = await getTasks(tenant);
  return tasks.find((task) => task.id === id) ?? null;
}
