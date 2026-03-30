/**
 * Task Filter Service
 * 
 * Utility functions for filter parameter serialization, validation, and conversion.
 * Handles transforming UI filter states to API query parameters.
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import type { TaskSearchParams, PaginationMeta } from '@/features/tasks/contracts';
import type { TaskStatus, TaskPriority } from '@/features/tasks/types/task.types';

/**
 * Validate and normalize a per-page value
 * 
 * Per spec: Results per page must be 1-100, default 15
 * 
 * @param perPage - Requested per-page value
 * @returns Validated per-page value (1-100)
 * 
 * @example
 * validatePerPage(0)   // 1
 * validatePerPage(15)  // 15
 * validatePerPage(200) // 100
 */
export function validatePerPage(perPage: number | undefined): number {
  if (!perPage) return 15;
  return Math.max(1, Math.min(100, perPage));
}

/**
 * Validate and normalize a page number
 * 
 * Page numbers must be >= 1
 * 
 * @param page - Requested page number
 * @returns Validated page number (>= 1)
 * 
 * @example
 * validatePage(0)   // 1
 * validatePage(5)   // 5
 * validatePage(-10) // 1
 */
export function validatePage(page: number | undefined): number {
  if (!page) return 1;
  return Math.max(1, page);
}

/**
 * Validate date format (ISO8601: YYYY-MM-DD)
 * 
 * @param date - Date string to validate
 * @returns True if valid ISO8601 date format, false otherwise
 * 
 * @example
 * isValidDate('2026-03-15')  // true
 * isValidDate('03/15/2026')  // false
 * isValidDate('')            // true (empty is ok)
 */
export function isValidDate(date: string | undefined): boolean {
  if (!date) return true;
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) return false;

  // Additional validation: check if date is actually valid
  const dateObj = new Date(`${date}T00:00:00Z`);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * Validate and normalize due date range
 * 
 * Ensures from <= to if both are provided
 * Removes 'to' if 'from' > 'to'
 * 
 * @param from - Start date (ISO8601)
 * @param to - End date (ISO8601)
 * @returns Tuple of [validFrom, validTo]
 * 
 * @example
 * validateDateRange('2026-03-15', '2026-04-15')
 * // ['2026-03-15', '2026-04-15']
 * 
 * validateDateRange('2026-04-15', '2026-03-15')
 * // ['2026-04-15', undefined] - reversed, so 'to' is removed
 */
export function validateDateRange(
  from?: string,
  to?: string,
): [string | undefined, string | undefined] {
  if (!isValidDate(from) || !isValidDate(to)) {
    return [from, to];
  }

  if (from && to && from > to) {
    // from is after to, so return only from
    return [from, undefined];
  }

  return [from, to];
}

/**
 * Check if status filter has any values
 */
export function hasStatusFilter(statuses: TaskStatus[] | undefined): boolean {
  return Array.isArray(statuses) && statuses.length > 0;
}

/**
 * Check if priority filter has any values
 */
export function hasPriorityFilter(priorities: TaskPriority[] | undefined): boolean {
  return Array.isArray(priorities) && priorities.length > 0;
}

/**
 * Check if any search or filter parameters are active
 */
export function hasActiveFilters(params: TaskSearchParams): boolean {
  return !!(
    params.search ||
    hasStatusFilter(Array.isArray(params.status) ? params.status : (params.status ? [params.status] : undefined)) ||
    hasPriorityFilter(Array.isArray(params.priority) ? params.priority : (params.priority ? [params.priority] : undefined)) ||
    params.task_type ||
    params.department_id ||
    params.assignee_id ||
    params.due_date_from ||
    params.due_date_to
  );
}

/**
 * Get human-readable description of search parameters for logging/debugging
 * 
 * @param params - Search parameters
 * @returns Description string like "search='bug', status=['TODO'], page=2"
 */
export function getParamsDescription(params: TaskSearchParams): string {
  const parts: string[] = [];

  if (params.search) parts.push(`search='${params.search}'`);

  if (hasStatusFilter(Array.isArray(params.status) ? params.status : (params.status ? [params.status] : undefined))) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    parts.push(`status=${JSON.stringify(statuses)}`);
  }

  if (hasPriorityFilter(Array.isArray(params.priority) ? params.priority : (params.priority ? [params.priority] : undefined))) {
    const priorities = Array.isArray(params.priority) ? params.priority : [params.priority];
    parts.push(`priority=${JSON.stringify(priorities)}`);
  }

  if (params.task_type) parts.push(`task_type='${params.task_type}'`);
  if (params.department_id) parts.push(`department_id=${params.department_id}`);
  if (params.assignee_id) parts.push(`assignee_id=${params.assignee_id}`);
  if (params.due_date_from) parts.push(`due_date_from='${params.due_date_from}'`);
  if (params.due_date_to) parts.push(`due_date_to='${params.due_date_to}'`);

  if (params.page && params.page > 1) parts.push(`page=${params.page}`);
  if (params.per_page && params.per_page !== 15) parts.push(`per_page=${params.per_page}`);
  if (params.sort_by && params.sort_by !== 'created_at') parts.push(`sort_by='${params.sort_by}'`);
  if (params.sort_order && params.sort_order !== 'desc') parts.push(`sort_order='${params.sort_order}'`);

  return parts.join(', ') || 'no filters';
}

/**
 * Format pagination metadata for display
 * 
 * @param meta - Pagination metadata from API response
 * @returns Human-readable string like "Page 2 of 7 (15 per page, 100 total)"
 */
export function formatPaginationInfo(meta: PaginationMeta): string {
  return `Page ${meta.current_page} of ${meta.last_page} (${meta.per_page} per page, ${meta.total} total)`;
}

/**
 * Get pagination summary text
 * 
 * @param meta - Pagination metadata
 * @returns String like "Showing results 1-15 of 100"
 */
export function getPaginationSummary(meta: PaginationMeta): string {
  if (meta.total === 0) {
    return 'No results';
  }
  return `Showing results ${meta.from}-${meta.to} of ${meta.total}`;
}

/**
 * Service object namespace for consistency with other services
 */
export const taskFilterService = {
  validatePerPage,
  validatePage,
  isValidDate,
  validateDateRange,
  hasStatusFilter,
  hasPriorityFilter,
  hasActiveFilters,
  getParamsDescription,
  formatPaginationInfo,
  getPaginationSummary,
};

export default taskFilterService;
