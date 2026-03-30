/**
 * Task API Functions
 * 
 * Handles API calls for tasks with real API integration
 * Uses TaskApiService (OOP) and TaskTransformer for data mapping
 */

import { taskApiService } from './TaskApiService';
import { taskTransformer } from '../utils/TaskTransformer';
import { filterTasks } from '../utils/taskFilters';
import { logger } from '@/shared/utils/logger';
import type { Task, TaskFilters } from '../types/task.types';
import { DEFAULT_FILTERS } from '../types/task.types';

const log = logger.createScoped('taskApi');

/**
 * Fetch tasks from API with optional filters
 * 
 * Features:
 * - Real API integration
 * - Data transformation from API format to domain model
 * - Client-side filtering
 * - Error handling and logging
 * 
 * @param tenant - Tenant identifier
 * @param filters - Optional filter criteria
 * @returns Promise with array of transformed tasks
 */
export async function getTasks(
  tenant: string,
  filters: TaskFilters = DEFAULT_FILTERS
): Promise<Task[]> {
  try {
    log.info('Fetching tasks from API', { tenant, filters });

    // Fetch raw data from API service
    const apiTasks = await taskApiService.fetchTasks(tenant, filters);

    // Transform API response to domain model
    const tasks = taskTransformer.transformTasks(apiTasks);

    // Apply client-side filters if needed
    const filteredTasks = filterTasks(tasks, filters);

    log.info(`Successfully fetched and transformed ${filteredTasks.length} tasks`);

    return filteredTasks;
  } catch (error) {
    log.error('Failed to fetch tasks', { error });
    throw error;
  }
}

/**
 * Fetch a single task by ID
 * 
 * @param tenant - Tenant identifier
 * @param id - Task ID to fetch
 * @returns Promise with transformed task or null if not found
 */
export async function getTaskById(
  tenant: string,
  id: number
): Promise<Task | null> {
  try {
    log.info(`Fetching task ${id}`, { tenant });

    // Fetch from API
    const apiTask = await taskApiService.fetchTaskById(tenant, id);

    // Transform to domain model
    const task = taskTransformer.transformTask(apiTask);

    log.info(`Successfully fetched task ${id}`);

    return task;
  } catch (error) {
    log.error(`Failed to fetch task ${id}`, { error });
    return null;
  }
}

/**
 * Fetch last tasks for a tenant
 * 
 * Features:
 * - Real API integration
 * - Data transformation from API format to domain model
 * - Error handling and logging
 * 
 * @param tenant - Tenant identifier
 * @returns Promise with array of transformed last tasks
 */
export async function getLastTasks(tenant: string): Promise<Task[]> {
  try {
    log.info('Fetching last tasks from API', { tenant });

    // Fetch raw data from API service
    const apiTasks = await taskApiService.fetchLastTasks(tenant);

    // Transform API response to domain model
    const tasks = taskTransformer.transformTasks(apiTasks);

    log.info(`Successfully fetched and transformed ${tasks.length} last tasks`);

    return tasks;
  } catch (error) {
    log.error('Failed to fetch last tasks', { error });
    throw error;
  }
}
