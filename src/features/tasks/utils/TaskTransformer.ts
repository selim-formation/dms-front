/**
 * TaskTransformer - Data Transformation Layer
 * Converts API response format to domain types
 * 
 * Responsibility:
 * - Transform snake_case API fields to camelCase domain model
 * - Handle null/undefined values gracefully
 * - Ensure type safety
 * - Encapsulate transformation logic
 */

import type { Task, TaskStatus, TaskPriority } from '../types/task.types';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('TaskTransformer');

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

/**
 * TaskTransformer class - Singleton pattern
 * Encapsulates all task data transformation logic
 */
export class TaskTransformer {
  private static instance: TaskTransformer;

  private constructor() { }

  /**
   * Get singleton instance
   */
  public static getInstance(): TaskTransformer {
    if (!TaskTransformer.instance) {
      TaskTransformer.instance = new TaskTransformer();
    }
    return TaskTransformer.instance;
  }

  /**
   * Transform single API response to domain Task
   * @param apiTask - Raw API response
   * @returns Transformed Task object
   */
  public transformTask(apiTask: TaskApiResponse): Task {
    try {
      // Validate status and priority
      const status = this.validateStatus(apiTask.status);
      const priority = this.validatePriority(apiTask.priority);

      // Extract date from ISO string (YYYY-MM-DD format)
      const dueDate = apiTask.due_date
        ? apiTask.due_date.split('T')[0]
        : null;

      const task: Task = {
        id: apiTask.id,
        title: apiTask.title || 'Untitled Task',
        description: apiTask.description,
        status,
        priority,
        dueDate,
        assignee: apiTask.assignee.id
          ? {
            id: apiTask.assignee.id,
            name: apiTask.assignee.name || 'Unknown',
            avatar: null, // API doesn't provide avatars
          }
          : null,
        creator: {
          id: apiTask.creator.id,
          name: apiTask.creator.name || 'Unknown',
          avatar: null,
        },
        createdAt: apiTask.created_at,
        updatedAt: apiTask.updated_at,
        tags: apiTask.tags || [],
        department: apiTask.department.name || null,
        relatedDocumentsCount: apiTask.document.id ? 1 : 0,
      };

      return task;
    } catch (error) {
      log.error('Error transforming task', { error, apiTask });
      throw new Error(`Failed to transform task: ${error}`);
    }
  }

  /**
   * Transform array of API responses to domain Tasks
   * @param apiTasks - Array of raw API responses
   * @returns Array of transformed Task objects
   */
  public transformTasks(apiTasks: TaskApiResponse[]): Task[] {
    try {
      log.info(`Transforming ${apiTasks.length} tasks`);

      return apiTasks.map((apiTask) => this.transformTask(apiTask));
    } catch (error) {
      log.error('Error transforming tasks array', { error });
      throw error;
    }
  }

  /**
   * Validate and normalize task status
   * @param status - Status value from API
   * @returns Valid TaskStatus
   */
  private validateStatus(status: string): TaskStatus {
    const validStatuses: TaskStatus[] = [
      'TODO',
      'IN_PROGRESS',
      'COMPLETED',
      'BLOCKED',
    ];

    const normalized = String(status).toUpperCase();

    if (validStatuses.includes(normalized as TaskStatus)) {
      return normalized as TaskStatus;
    }

    log.warn(`Invalid status "${status}", defaulting to TODO`);
    return 'TODO';
  }

  /**
   * Validate and normalize task priority
   * @param priority - Priority value from API
   * @returns Valid TaskPriority
   */
  private validatePriority(priority: string): TaskPriority {
    const validPriorities: TaskPriority[] = [
      'LOW',
      'MEDIUM',
      'HIGH',
      'URGENT',
    ];

    const normalized = String(priority).toUpperCase();

    if (validPriorities.includes(normalized as TaskPriority)) {
      return normalized as TaskPriority;
    }

    log.warn(`Invalid priority "${priority}", defaulting to MEDIUM`);
    return 'MEDIUM';
  }
}

/**
 * Export singleton instance
 */
export const taskTransformer = TaskTransformer.getInstance();
