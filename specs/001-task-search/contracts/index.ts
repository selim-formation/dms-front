/**
 * Task Search Contracts Index
 * Central export point for all API contracts
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

// Re-export all search API contracts
export type {
  TaskSearchParams,
  PartialTaskSearchParams,
  TaskSearchQueryString,
  PaginationMeta,
  TaskSearchResponse,
  TaskSearchErrorResponse,
} from './search-api';

// Re-export task entity types for convenience
export type { Task, TaskStatus, TaskPriority, User } from '@/features/tasks/types/task.types';

/**
 * All contracts available from this directory
 * Import usage:
 *   import type { TaskSearchParams, TaskSearchResponse } from '@/features/tasks/contracts';
 */
