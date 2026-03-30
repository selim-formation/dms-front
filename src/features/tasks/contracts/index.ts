/**
 * Task Search & Filter API Contract Types
 * 
 * This file re-exports types from the specification documents.
 * Used throughout the application for search API integration.
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import type { TaskStatus, TaskPriority, User, Task } from '@/features/tasks/types/task.types';

// ============================================================================
// Search Request Parameters
// ============================================================================

/**
 * Query parameters for task search API endpoint
 * Sent as: GET /api/tasks/search?search=...&status=TODO&...
 */
export interface TaskSearchParams {
  /** Full-text search term for title/description */
  search?: string;

  /** Filter by task status (multiple values allowed) */
  status?: TaskStatus | TaskStatus[];

  /** Filter by task priority (multiple values allowed) */
  priority?: TaskPriority | TaskPriority[];

  /** Filter by task type (if backend supports) */
  task_type?: string;

  /** Filter by department ID */
  department_id?: number;

  /** Filter by assignee user ID */
  assignee_id?: number;

  /** Filter by due date start (ISO8601: YYYY-MM-DD) */
  due_date_from?: string;

  /** Filter by due date end (ISO8601: YYYY-MM-DD) */
  due_date_to?: string;

  /** Results per page (1-100, default 15) */
  per_page?: number;

  /** Current page number (1-indexed, default 1) */
  page?: number;

  /** Field to sort by (default: created_at) */
  sort_by?: 'created_at' | 'due_date' | 'priority' | 'status';

  /** Sort direction (default: desc) */
  sort_order?: 'asc' | 'desc';
}

// ============================================================================
// Pagination Metadata
// ============================================================================

/**
 * Pagination metadata included in API response
 * Describes current page position in result set
 */
export interface PaginationMeta {
  /** Total number of results across all pages */
  total: number;

  /** Results per page (matches request param) */
  per_page: number;

  /** Current page number (1-indexed) */
  current_page: number;

  /** Last page number */
  last_page: number;

  /** Index of first result in this page (1-indexed) */
  from: number;

  /** Index of last result in this page (1-indexed) */
  to: number;
}

// ============================================================================
// Search Response
// ============================================================================

/**
 * API response from /api/tasks/search endpoint
 * Contains matched tasks and optional pagination information
 */
export interface TaskSearchResponse {
  /** Array of matched tasks */
  data: Task[];

  /** Human-readable success message */
  message: string;

  /** Pagination metadata for result navigation (optional) */
  meta?: PaginationMeta;

  /** Response status indicator (optional) */
  status?: 'success' | 'error';

  /** HTTP status code (optional) */
  code?: number;
}

// ============================================================================
// Re-export core types for convenience
// ============================================================================

export type { TaskStatus, TaskPriority, User, Task };
