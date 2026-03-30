/**
 * TaskApiService - OOP API Service Layer
 * Handles all HTTP requests related to tasks
 * 
 * Features:
 * - Encapsulation of API logic
 * - Type-safe API interactions
 * - Error handling and logging
 * - Request/response transformation
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type { Task, TaskFilters } from '../types/task.types';

const log = logger.createScoped('TaskApiService');

/**
 * API response structure from server
 */
interface TaskApiResponse {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  task_type: string;
  assignee: {
    id: number | null;
    name: string | null;
    email: string | null;
  };
  creator: {
    id: number;
    name: string;
    email: string;
  };
  document: {
    id: number | null;
    title: string | null;
  };
  department: {
    id: number | null;
    name: string | null;
  };
  tags: string[] | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface GetTasksApiResponse {
  data: TaskApiResponse[];
  message: string;
}

/**
 * TaskApiService class - Singleton pattern
 * Encapsulates all task-related API operations
 */
export class TaskApiService {
  private static instance: TaskApiService;
  private readonly client = apiClient.getInstance();
  private readonly endpoints = apiEndpoints;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    log.info('TaskApiService initialized');
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): TaskApiService {
    if (!TaskApiService.instance) {
      TaskApiService.instance = new TaskApiService();
    }
    return TaskApiService.instance;
  }

  /**
   * Fetch all tasks for a tenant
   * @param tenant - Tenant identifier
   * @param filters - Optional filter criteria
   * @returns Promise with array of tasks
   */
  public async fetchTasks(
    tenant: string,
    filters?: TaskFilters
  ): Promise<TaskApiResponse[]> {
    try {
      log.info(`Fetching tasks for tenant: ${tenant}`, { filters });

      const url = buildApiUrl(this.endpoints.tasks.list, { tenant });

      const response = await this.client.get<GetTasksApiResponse>(url);

      if (!response.data || !response.data.data) {
        log.warn('Empty response received from tasks API');
        return [];
      }

      log.info(`Successfully fetched ${response.data.data.length} tasks`);
      return response.data.data;
    } catch (error) {
      log.error('Failed to fetch tasks', { error });
      throw error;
    }
  }

  /**
   * Fetch a single task by ID
   * @param tenant - Tenant identifier
   * @param taskId - Task ID to fetch
   * @returns Promise with task data
   */
  public async fetchTaskById(
    tenant: string,
    taskId: number
  ): Promise<TaskApiResponse> {
    try {
      log.info(`Fetching task ${taskId} for tenant: ${tenant}`);

      const url = buildApiUrl(this.endpoints.tasks.detail, {
        tenant,
        id: taskId,
      });

      const response = await this.client.get<{ data: TaskApiResponse }>(url);

      if (!response.data || !response.data.data) {
        throw new Error(`Task ${taskId} not found`);
      }

      log.info(`Successfully fetched task ${taskId}`);
      return response.data.data;
    } catch (error) {
      log.error(`Failed to fetch task ${taskId}`, { error });
      throw error;
    }
  }

  /**
   * Create a new task
   * @param tenant - Tenant identifier
   * @param taskData - Task data to create
   * @returns Promise with created task
   */
  public async createTask(
    tenant: string,
    taskData: Partial<Task>
  ): Promise<TaskApiResponse> {
    try {
      log.info(`Creating task for tenant: ${tenant}`, { taskData });

      const url = buildApiUrl(this.endpoints.tasks.create, { tenant });

      const response = await this.client.post<{ data: TaskApiResponse }>(
        url,
        taskData
      );

      if (!response.data || !response.data.data) {
        throw new Error('Failed to create task');
      }

      log.info(`Task created successfully with ID: ${response.data.data.id}`);
      return response.data.data;
    } catch (error) {
      log.error('Failed to create task', { error });
      throw error;
    }
  }

  /**
   * Update an existing task
   * @param tenant - Tenant identifier
   * @param taskId - Task ID to update
   * @param taskData - Updated task data
   * @returns Promise with updated task
   */
  public async updateTask(
    tenant: string,
    taskId: number,
    taskData: Partial<Task>
  ): Promise<TaskApiResponse> {
    try {
      log.info(`Updating task ${taskId} for tenant: ${tenant}`, { taskData });

      const url = buildApiUrl(this.endpoints.tasks.update, {
        tenant,
        id: taskId,
      });

      const response = await this.client.put<{ data: TaskApiResponse }>(
        url,
        taskData
      );

      if (!response.data || !response.data.data) {
        throw new Error('Failed to update task');
      }

      log.info(`Task ${taskId} updated successfully`);
      return response.data.data;
    } catch (error) {
      log.error(`Failed to update task ${taskId}`, { error });
      throw error;
    }
  }

  /**
   * Delete a task
   * @param tenant - Tenant identifier
   * @param taskId - Task ID to delete
   * @returns Promise that resolves when task is deleted
   */
  public async deleteTask(tenant: string, taskId: number): Promise<void> {
    try {
      log.info(`Deleting task ${taskId} for tenant: ${tenant}`);

      const url = buildApiUrl(this.endpoints.tasks.delete, {
        tenant,
        id: taskId,
      });

      await this.client.delete(url);

      log.info(`Task ${taskId} deleted successfully`);
    } catch (error) {
      log.error(`Failed to delete task ${taskId}`, { error });
      throw error;
    }
  }

  /**
   * Fetch last tasks for a tenant
   * @param tenant - Tenant identifier
   * @returns Promise with array of last tasks
   */
  public async fetchLastTasks(tenant: string): Promise<TaskApiResponse[]> {
    try {
      log.info(`Fetching last tasks for tenant: ${tenant}`);

      const url = buildApiUrl(this.endpoints.tasks.last, { tenant });

      const response = await this.client.get<GetTasksApiResponse>(url);

      if (!response.data || !response.data.data) {
        log.warn('Empty response received from last tasks API');
        return [];
      }

      log.info(`Successfully fetched ${response.data.data.length} last tasks`);
      return response.data.data;
    } catch (error) {
      log.error('Failed to fetch last tasks', { error });
      throw error;
    }
  }
}

/**
 * Export singleton instance
 */
export const taskApiService = TaskApiService.getInstance();
