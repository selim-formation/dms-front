'use client';

import { useMemo, memo } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useLastTasks } from '@/features/tasks';

import type { TenantContextValue } from '@/core/tenant/types';

interface Props {
  tenant: TenantContextValue;
}

interface TaskDisplay {
  id: number;
  title: string;
}

/**
 * NeedsReview Component
 * 
 * Displays last tasks that need review
 * Features:
 * - Real-time data from API
 * - Optimized re-renders with memo and useMemo
 * - Caching via TanStack Query
 * - Error handling and loading states
 * - Dynamic task count
 */
const NeedsReviewComponent = memo(function NeedsReview({ tenant }: Props) {
  // Fetch last tasks with caching and optimization
  const { tasks, isLoading, isError, error } = useLastTasks();
  console.log(tenant)
  // Memoize displayed tasks to prevent unnecessary re-renders
  const displayTasks: TaskDisplay[] = useMemo(() => {
    return tasks.slice(0, 5).map((task) => ({
      id: task.id,
      title: task.title || 'Untitled Task',
    }));
  }, [tasks]);

  // Memoize task count to prevent unnecessary re-renders
  const taskCount = useMemo(() => tasks.length, [tasks.length]);

  // Handle error state
  if (isError) {
    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-base font-bold text-foreground">
              Failed to load tasks
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : 'An error occurred while fetching tasks'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <h3 className="text-base font-bold text-foreground">
              Loading tasks...
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state
  if (taskCount === 0) {
    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <h3 className="text-base font-bold text-foreground">
              Needs your review
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            No tasks pending review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-accent" />
          <h3 className="text-base font-bold text-foreground">
            Needs your review
          </h3>
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {taskCount}
          </span>
        </div>
        <div className="space-y-2">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{task.title}</span>
            </div>
          ))}
        </div>
        <Link
          to="/$tenant/tasks"
          params={{ tenant: tenant?.tenantId ?? '' }}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold">
            Review All
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
});

// Set display name for debugging
NeedsReviewComponent.displayName = 'NeedsReview';

export default NeedsReviewComponent;
