/**
 * Task Search & Filter API Contracts
 * Exported types for use throughout the application
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { TaskStatus, TaskPriority, User, Task } from '@/features/tasks/types/task.types';

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
  sort_by?: 'created_at' | 'updated_at' | 'due_date' | 'priority' | 'title';

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
 * Contains matched tasks and pagination information
 */
export interface TaskSearchResponse {
  /** Human-readable success message */
  message: string;

  /** Response status indicator */
  status: 'success' | 'error';

  /** HTTP status code */
  code: number;

  /** Array of matching tasks */
  data: Task[];

  /** Pagination metadata */
  meta: PaginationMeta;
}

// ============================================================================
// Error Response
// ============================================================================

/**
 * Error response for failed task search
 */
export interface TaskSearchErrorResponse {
  message: string;
  status: 'error';
  code: number; // 400, 401, 403, 500, etc.
  data?: {
    errors?: Record<string, string[]>; // Field validation errors
  };
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Type-safe task search parameters with all fields optional
 * Use for building query objects incrementally
 */
export type PartialTaskSearchParams = Partial<TaskSearchParams>;

/**
 * Serialized query string parameters
 * For URL serialization
 */
export type TaskSearchQueryString = Record<string, string | number | boolean | undefined>;
