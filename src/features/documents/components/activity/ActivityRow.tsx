import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Monitor } from 'lucide-react';
import ActivityActionBadge from './ActivityActionBadge';
import { formatActivityDate, initialOf, userSubtitle } from '../../utils/activityFormat';
import type { DocumentActivityEntry } from '../../types/activity.types';

function MetaItem({ icon: Icon, label, children }: { icon: typeof Globe; label: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only">{label}:</span>
      <span dir="ltr">{children}</span>
    </span>
  );
}

/** One log entry. Memoised on the entry object, so paging re-renders only new rows. */
function ActivityRow({ entry }: { entry: DocumentActivityEntry }) {
  const { t, i18n } = useTranslation('documents');
  const name = entry.user?.name ?? t('activityPanel.deletedUser');
  const subtitle = entry.user ? userSubtitle(entry.user) : '';

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-muted/30">
      <div className="flex min-w-0 flex-1 basis-56 items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          aria-hidden="true"
        >
          {initialOf(name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground" dir="auto">
            {name}
          </p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground" dir="auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <ActivityActionBadge action={entry.action} />
        {entry.version !== null && (
          <span className="rounded-md bg-muted/60 px-2 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {t('documentVersions.versionLabel', { version: entry.version })}
          </span>
        )}
      </div>

      <div className="flex min-w-0 basis-full flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:basis-auto sm:justify-end md:flex-1">
        <time dateTime={entry.created_at} dir={i18n.dir()} className="[unicode-bidi:isolate]">{formatActivityDate(entry.created_at, i18n.language)}</time>
        {entry.source && <MetaItem icon={Monitor} label={t('activityPanel.source')}>{entry.source}</MetaItem>}
        {entry.ip && <MetaItem icon={Globe} label={t('activityPanel.ip')}>{entry.ip}</MetaItem>}
      </div>
    </li>
  );
}

export default memo(ActivityRow);
