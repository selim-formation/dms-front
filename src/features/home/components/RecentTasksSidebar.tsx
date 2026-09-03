import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListTodo } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { getRelativeTime } from '@/features/tasks/utils/dateFormat';
import { TASK_STATUS_LABELS, type Task } from '@/features/tasks/types/task.types';

interface Props {
  tenant: string;
}

const STATUS_DOT: Record<Task['status'], string> = {
  TODO: 'bg-muted-foreground',
  IN_PROGRESS: 'bg-info',
  COMPLETED: 'bg-success',
  BLOCKED: 'bg-destructive',
};

const RECENT_TASKS_LIMIT = 5;

function RecentTasksSidebar({ tenant }: Props) {
  const { t } = useTranslation(['home', 'common']);
  const { tasks, isLoading } = useTasks();

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, RECENT_TASKS_LIMIT),
    [tasks],
  );

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">{t('recentTasksSidebar.title')}</CardTitle>
          <Link to="/$tenant/tasks" params={{ tenant }} className="text-xs text-primary font-medium hover:underline">
            {t('recentTasksSidebar.viewAll')}
          </Link>
        </div>
      </CardHeader>

      {isLoading ? (
        <CardContent className="p-0 divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      ) : recentTasks.length === 0 ? (
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          {t('recentTasksSidebar.empty')}
        </CardContent>
      ) : (
        <CardContent className="p-0 divide-y divide-border">
          {recentTasks.map((task) => (
            <Link
              key={task.id}
              to="/$tenant/tasks"
              params={{ tenant }}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="relative h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ListTodo className="h-3.5 w-3.5 text-primary" />
                <span
                  className={`absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full border-2 border-background ${STATUS_DOT[task.status]}`}
                  title={TASK_STATUS_LABELS[task.status]}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {task.department ?? TASK_STATUS_LABELS[task.status]}
                  {task.assignee ? ` · ${task.assignee.name}` : ''}
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {getRelativeTime(task.createdAt)}
              </span>
            </Link>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

export default memo(RecentTasksSidebar);
