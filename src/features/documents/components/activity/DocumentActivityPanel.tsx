import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, History } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import PaginationControl from '@/shared/components/ui/PaginationControl';
import ActivityFilterBar, { type VersionOption } from './ActivityFilterBar';
import ActivityRow from './ActivityRow';
import { useActivityFilterState } from '../../hooks/useActivityFilterState';
import { useDocumentActivities } from '../../hooks/useDocumentActivities';
import type { DocumentVersionEntry } from '../../types/api.types';

interface DocumentActivityPanelProps {
  documentId: number;
  /** Older versions, for the version filter (the current one has no id in the view payload). */
  versionHistory?: DocumentVersionEntry[];
}

const RowsSkeleton = memo(function RowsSkeleton() {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3 rounded-2xl border border-border/60 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </li>
      ))}
    </ul>
  );
});

function StateMessage({ icon: Icon, title, description, action }: { icon: typeof History; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Icon className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

/** Activity tab: filters + a paginated, newest-first log. Mounted (and so fetched) only while the tab is open. */
function DocumentActivityPanel({ documentId, versionHistory }: DocumentActivityPanelProps) {
  const { t } = useTranslation('documents');
  const { values, filters, page, setPage, patch, clear, hasActiveFilters } = useActivityFilterState();
  const { activities, meta, isLoading, isFetching, isError, refetch } = useDocumentActivities(documentId, filters);

  const versionOptions = useMemo<VersionOption[]>(
    () => (versionHistory ?? []).map((v) => ({ id: v.id, version: v.version })),
    [versionHistory],
  );
  const pageLabel = useCallback(
    () => t('activityPanel.pageLabel', { current: meta?.current_page ?? page, last: meta?.last_page ?? 1 }),
    [t, meta?.current_page, meta?.last_page, page],
  );

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6" aria-label={t('activityPanel.heading')}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">{t('activityPanel.heading')}</h3>
        {meta && <span className="text-xs text-muted-foreground">{t('activityPanel.total', { count: meta.total })}</span>}
      </div>

      <ActivityFilterBar values={values} onChange={patch} onClear={clear} hasActiveFilters={hasActiveFilters} versions={versionOptions} />

      {isLoading ? (
        <RowsSkeleton />
      ) : isError ? (
        <StateMessage
          icon={AlertCircle}
          title={t('activityPanel.error')}
          action={
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              {t('activityPanel.retry')}
            </Button>
          }
        />
      ) : activities.length === 0 ? (
        <StateMessage
          icon={History}
          title={t(hasActiveFilters ? 'activityPanel.noMatches' : 'activityPanel.empty')}
          description={hasActiveFilters ? t('activityPanel.noMatchesHint') : undefined}
          action={
            hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={clear}>
                {t('activityPanel.filters.clear')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className={isFetching ? 'space-y-3 opacity-70 transition-opacity' : 'space-y-3 transition-opacity'} aria-busy={isFetching}>
          {activities.map((entry) => (
            <ActivityRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}

      <PaginationControl
        currentPage={meta?.current_page ?? 1}
        lastPage={meta?.last_page ?? 1}
        onPageChange={setPage}
        disabled={isFetching}
        label={pageLabel()}
        className="mt-2"
      />
    </section>
  );
}

export default memo(DocumentActivityPanel);
