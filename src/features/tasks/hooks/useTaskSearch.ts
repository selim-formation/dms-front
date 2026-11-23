/**
 * useTaskSearch - Placeholder
 *
 * Not wired into the app; stub returns an idle empty result so
 * TaskSearchPage compiles.
 */

import type { Task } from '../types/task.types';
import type { TaskSearchParams, PaginationMeta } from '../contracts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useTaskSearch(_params: TaskSearchParams): {
  data: { data: Task[]; meta: PaginationMeta } | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  return { data: undefined, isLoading: false, error: null, refetch: () => {} };
}
