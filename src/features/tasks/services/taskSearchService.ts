/**
 * Task Search Service
 * 
 * Handles API calls to /api/tasks/search endpoint.
 * Provides methods for fetching tasks with search, filtering, pagination, and sorting.
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { apiClient } from '@/core/api/client';
import type { TaskSearchParams, TaskSearchResponse } from '@/features/tasks/contracts';

/**
 * Search tasks with filters, pagination, and sorting
 * 
 * @param params - Query parameters for the search
 * @param tenantId - Tenant ID for the API endpoint
 * @returns Promise containing matched tasks and pagination metadata
 * 
 * @example
 * const response = await taskSearchService.search({
 *   search: 'database migration',
 *   status: ['TODO', 'IN_PROGRESS'],
 *   priority: ['HIGH', 'URGENT'],
 *   per_page: 15,
 *   page: 1,
 *   sort_by: 'created_at',
 *   sort_order: 'desc'
 * }, tenantId);
 * 
 * console.log(`Found ${response.meta.total} tasks`);
 * response.data.forEach(task => console.log(task.title));
 */
export async function searchTasks(params: TaskSearchParams, tenantId: string): Promise<TaskSearchResponse> {
  try {
    // Build query string from parameters
    const query = buildQueryString(params);

    // Make API request with tenant ID in path
    const response = await apiClient.get<TaskSearchResponse>(
      `/api/${tenantId}/tasks/search${query}`,
    );

    console.log('Search API response:', response);

    // Get the data from Axios response
    const data = response.data as any;

    // Validate response structure - data array and message are required
    // if (!data || !Array.isArray(data.data)) {
    //   throw new Error('Invalid response structure from search API - expected data array');
    // }

    return data as TaskSearchResponse;
  } catch (error) {
    console.error('Task search failed:', error);
    throw error;
  }
}

/**
 * Build URL query string from search parameters
 * Filters out undefined values and handles array parameters
 * 
 * @param params - Task search parameters
 * @returns Query string including leading "?" or empty string
 * 
 * @internal Implementation detail - handles parameter serialization
 */
function buildQueryString(params: TaskSearchParams): string {
  const searchParams = new URLSearchParams();

  // Add string parameters
  if (params.search) {
    searchParams.append('search', params.search);
  }

  // Add array parameters (status, priority)
  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    statuses.forEach(status => searchParams.append('status[]', status));
  }

  if (params.priority) {
    const priorities = Array.isArray(params.priority) ? params.priority : [params.priority];
    priorities.forEach(priority => searchParams.append('priority[]', priority));
  }

  // Add filter parameters
  if (params.task_type) {
    searchParams.append('task_type', params.task_type);
  }

  if (params.department_id) {
    searchParams.append('department_id', String(params.department_id));
  }

  if (params.assignee_id) {
    searchParams.append('assignee_id', String(params.assignee_id));
  }

  // Add date range parameters
  if (params.due_date_from) {
    searchParams.append('due_date_from', params.due_date_from);
  }

  if (params.due_date_to) {
    searchParams.append('due_date_to', params.due_date_to);
  }

  // Add pagination parameters
  if (params.per_page) {
    searchParams.append('per_page', String(Math.max(1, Math.min(100, params.per_page))));
  }

  if (params.page) {
    searchParams.append('page', String(Math.max(1, params.page)));
  }

  // Add sorting parameters
  if (params.sort_by) {
    searchParams.append('sort_by', params.sort_by);
  }

  if (params.sort_order) {
    searchParams.append('sort_order', params.sort_order);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Service object namespace for consistency with other services
 */
export const taskSearchService = {
  search: searchTasks,
};

export default taskSearchService;
