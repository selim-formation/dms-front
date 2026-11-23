import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityAction } from '../../types/activity.types';

const STYLES: Record<ActivityAction, { icon: typeof Eye; className: string }> = {
  view: { icon: Eye, className: 'bg-muted text-muted-foreground' },
  download: { icon: Download, className: 'bg-info/10 text-info' },
};

/** view = grey, download = blue. Unknown actions fall back to the view look with their raw name. */
function ActivityActionBadge({ action }: { action: ActivityAction }) {
  const { t } = useTranslation('documents');
  const { icon: Icon, className } = STYLES[action] ?? STYLES.view;

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {t(`activityPanel.actions.${action}`, { defaultValue: action })}
    </span>
  );
}

export default memo(ActivityActionBadge);
