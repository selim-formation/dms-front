<<<<<<< Updated upstream
=======
'use client';

import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
>>>>>>> Stashed changes
import { AlertTriangle, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

const REVIEWS = [
  'Contract Renewal',
  'Policy Update',
  'Budget v2',
];

<<<<<<< Updated upstream
interface Props { tenant: string }
=======
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
  const { t } = useTranslation(['home', 'common']);
  // Fetch last tasks with caching and optimization
  const { tasks, isLoading, isError, error } = useLastTasks();
  console.log(tenant)
  // Memoize displayed tasks to prevent unnecessary re-renders
  const displayTasks: TaskDisplay[] = useMemo(() => {
    return tasks.slice(0, 5).map((task) => ({
      id: task.id,
      title: task.title || t('needsReview.untitledTask'),
    }));
  }, [tasks, t]);

  // Memoize task count to prevent unnecessary re-renders
  const taskCount = useMemo(() => tasks.length, [tasks.length]);

  // Handle error state
  if (isError) {
    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="text-base font-bold text-foreground">
              {t('needsReview.failedToLoad')}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : t('needsReview.fetchError')}
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
              {t('needsReview.loadingTasks')}
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
              {t('needsReview.title')}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('needsReview.noTasksPending')}
          </p>
        </CardContent>
      </Card>
    );
  }
>>>>>>> Stashed changes

export default function NeedsReview({ tenant }: Props) {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-accent" />
<<<<<<< Updated upstream
          <h3 className="text-base font-bold text-foreground">Needs your review</h3>
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">3</span>
=======
          <h3 className="text-base font-bold text-foreground">
            {t('needsReview.title')}
          </h3>
          <span className="ms-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {taskCount}
          </span>
>>>>>>> Stashed changes
        </div>
        <div className="space-y-2">
          {REVIEWS.map((r) => (
            <div key={r} className="flex items-center gap-2 text-sm text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {r}
            </div>
          ))}
        </div>
        <Link to={`/${tenant}/documents`}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold">
            {t('needsReview.reviewAll')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
