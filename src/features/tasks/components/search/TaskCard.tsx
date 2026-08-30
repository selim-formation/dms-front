/**
 * TaskCard Component (Search Variant)
 * 
 * Task card component optimized for search results display.
 * Shows title, description excerpt, status, priority, assignee, due date, and department.
 * Per spec: Displays status badge, priority badge, assignee, due date
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { useTranslation } from 'react-i18next';
import type { Task } from '@/features/tasks/types/task.types';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@/features/tasks/types/task.types';
import { Badge } from '@/shared/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: (taskId: number) => void;
  isHighlighted?: boolean;
  highlightedText?: string;
}

/**
 * Display color for task status
 */
function getStatusBadgeVariant(
  status: Task['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'TODO':
      return 'outline';
    case 'IN_PROGRESS':
      return 'secondary';
    case 'COMPLETED':
      return 'default';
    case 'BLOCKED':
      return 'destructive';
    default:
      return 'outline';
  }
}

/**
 * Display color for task priority
 */
function getPriorityBadgeColor(priority: Task['priority']): string {
  switch (priority) {
    case 'LOW':
      return 'bg-secondary text-secondary-foreground';
    case 'MEDIUM':
      return 'bg-warning/10 text-warning';
    case 'HIGH':
      return 'bg-warning/20 text-warning';
    case 'URGENT':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

/**
 * Check if due date is overdue
 */
function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

/**
 * Format due date for display
 */
function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return '';
  const date = new Date(`${dueDate}T00:00:00Z`);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Task card for search results
 * Displays task details in a clickable card format
 * 
 * @param props - Component props
 * @returns JSX.Element
 * 
 * @example
 * <TaskCard
 *   task={task}
 *   onClick={(taskId) => navigate(`/tasks/${taskId}`)}
 * />
 */
export function TaskCard({
  task,
  onClick,
  isHighlighted = false,
}: TaskCardProps) {
  const { t } = useTranslation(['tasks', 'common']);
  const overdue = isOverdue(task.dueDate);

  return (
    <button
      onClick={() => onClick?.(task.id)}
      className={`
        w-full text-start p-4 rounded-lg border transition-all
        hover:shadow-md hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary
        ${isHighlighted ? 'bg-warning/10 border-warning/40' : 'bg-card border-border'}
      `}
      type="button"
      aria-label={t('tasks:searchCard.taskLabel', { title: task.title })}
    >
      {/* Header: Title and Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold text-foreground flex-1 break-words">
          {task.title}
        </h3>
        <div className="flex-shrink-0">
          <Badge variant={getStatusBadgeVariant(task.status)}>
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
        </div>
      </div>

      {/* Description preview - max 2 lines */}
      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Metadata badges row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Priority badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
          {TASK_PRIORITY_LABELS[task.priority]}
        </span>

        {/* Department badge - if available */}
        {task.department && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
            {task.department}
          </span>
        )}

        {/* Related documents count - if any */}
        {task.relatedDocumentsCount > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-chart-1/10 text-chart-1">
            {t('tasks:searchCard.docCount', { count: task.relatedDocumentsCount })}
          </span>
        )}
      </div>

      {/* Footer: Assignee and Due Date */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{task.assignee.name}</span>
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={`flex items-center gap-1.5 flex-shrink-0 ${overdue ? 'text-destructive font-medium' : ''}`}
            title={t('tasks:searchCard.dueLabel', { date: task.dueDate })}
          >
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </button>
  );
}
