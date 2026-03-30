/**
 * TaskResultsList Component
 * 
 * Container component for displaying paginated task search results.
 * Shows list of TaskCards with pagination controls and empty state.
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import type { Task } from '@/features/tasks/types/task.types';
import { TaskCard } from './TaskCard';
import { TaskLoadingSkeleton } from './TaskLoadingSkeleton';
import type { PaginationMeta } from '@/features/tasks/contracts';

interface TaskResultsListProps {
  /** Array of tasks to display */
  tasks: Task[];

  /** Whether results are currently loading */
  isLoading: boolean;

  /** Pagination metadata */
  pagination?: PaginationMeta;

  /** Called when a task card is clicked */
  onTaskClick?: (taskId: number) => void;

  /** Search term for highlighting (future enhancement) */
  searchTerm?: string;

  /** Empty state message */
  emptyMessage?: string;

  /** Number of skeleton loaders to show while loading */
  loadingCount?: number;
}

/**
 * Display pagination summary
 */
function PaginationSummary({ meta }: { meta: PaginationMeta }) {
  if (meta.total === 0) {
    return <p className="text-sm text-gray-600">No results found</p>;
  }

  return (
    <p className="text-sm text-gray-600">
      Showing results {meta.from} to {meta.to} of {meta.total}
      {meta.last_page > 1 && ` (Page ${meta.current_page} of ${meta.last_page})`}
    </p>
  );
}

/**
 * Empty state component
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        <p className="text-gray-600 mb-4">{message}</p>
        <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
      </div>
    </div>
  );
}

/**
 * Task results list component
 * Displays paginated task search results with loading states
 * 
 * @param props - Component props
 * @returns JSX.Element
 * 
 * @example
 * <TaskResultsList
 *   tasks={tasks}
 *   isLoading={isLoading}
 *   pagination={pagination}
 *   onTaskClick={(taskId) => navigate(`/tasks/${taskId}`)}
 *   searchTerm="bug fix"
 * />
 */
export function TaskResultsList({
  tasks,
  isLoading,
  pagination,
  onTaskClick,
  searchTerm,
  emptyMessage = 'No tasks found',
  loadingCount = 3,
}: TaskResultsListProps) {
  // Show loading skeleton while fetching
  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-4">
        <TaskLoadingSkeleton count={loadingCount} />
      </div>
    );
  }

  // Show empty state if no results
  if (!isLoading && tasks.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  // Show results with pagination info
  return (
    <div className="space-y-4">
      {/* Pagination summary */}
      {pagination && (
        <div className="flex items-center justify-between">
          <PaginationSummary meta={pagination} />
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            highlightedText={searchTerm}
          />
        ))}
      </div>

      {/* Loading indicator for pagination */}
      {isLoading && tasks.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full" />
        </div>
      )}
    </div>
  );
}
