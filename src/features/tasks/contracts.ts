/**
 * Task Search Contracts - Placeholder
 *
 * Not wired into the app; shapes for the dead task-search page cluster.
 */

import type { TaskStatus, TaskPriority } from './types/task.types';

export interface TaskSearchParams {
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
