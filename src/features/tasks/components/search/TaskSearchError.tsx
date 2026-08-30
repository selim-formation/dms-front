/**
 * TaskSearchError Component
 * 
 * Error banner with retry functionality.
 * Per spec FR-025 (clarification Q1): Show error banner, hide previous results, provide retry
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { useTranslation } from 'react-i18next';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface TaskSearchErrorProps {
  /** Error message to display */
  message?: string;

  /** Called when retry button is clicked */
  onRetry: () => void;

  /** Called when close button is clicked */
  onClose?: () => void;

  /** Whether retry is currently loading */
  isRetrying?: boolean;
}

/**
 * Error banner component for task search failures
 * 
 * Shows error message with retry button
 * Dismissible with close button
 * Provides clear feedback to user about search failures
 * 
 * @param props - Component props
 * @returns JSX.Element
 * 
 * @example
 * <TaskSearchError 
 *   message="Failed to load tasks. Please try again."
 *   onRetry={() => refetch()}
 *   onClose={() => setShowError(false)}
 *   isRetrying={isFetching}
 * />
 */
export function TaskSearchError({
  message,
  onRetry,
  onClose,
  isRetrying = false,
}: TaskSearchErrorProps) {
  const { t } = useTranslation(['tasks', 'common']);

  return (
    <div
      role="alert"
      className="w-full bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3"
    >
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-destructive mb-1">
          {t('tasks:searchError.title')}
        </h3>
        <p className="text-sm text-destructive">
          {message ?? t('tasks:searchError.defaultMessage')}
        </p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="default"
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          {isRetrying ? t('tasks:searchError.retrying') : t('tasks:searchError.retry')}
        </Button>

        {onClose && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            aria-label={t('tasks:searchError.closeError')}
            className="text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
