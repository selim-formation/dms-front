/**
 * TaskLoadingSkeleton Component
 * 
 * Skeleton loader component for task cards
 * Used during initial load and while fetching new search results
 * Per FR-024: Skeleton loaders for loading state
 * 
 * Feature: 001-task-search  
 * Date: 15 March 2026
 */

import { Skeleton } from '@/shared/components/ui/skeleton';

interface TaskLoadingSkeletonProps {
  /** Number of skeleton cards to display */
  count?: number;
}

/**
 * Displays skeleton loading animation for task cards
 * Provides visual feedback while API calls are in progress
 * 
 * @param count - Number of loading placeholders (default: 3)
 * @returns Skeleton UI matching TaskCard layout
 * 
 * @example
 * <TaskLoadingSkeleton count={5} />
 */
export function TaskLoadingSkeleton({ count = 3 }: TaskLoadingSkeletonProps) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-4 border border-border rounded-lg bg-card space-y-3">
          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Metadata row (badges, assignee, due date) */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-20" /> {/* Status badge */}
            <Skeleton className="h-6 w-20" /> {/* Priority badge */}
            <Skeleton className="h-4 w-40 ms-auto" /> {/* Assignee + due date */}
          </div>
        </div>
      ))}
    </div>
  );
}
