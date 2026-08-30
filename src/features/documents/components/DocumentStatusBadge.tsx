import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/components/ui/badge';
import type { DocumentStatus, Importance } from '../types/index';

const statusClassNames: Record<DocumentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-success/15 text-success',
  archived: 'bg-secondary text-secondary-foreground',
  expired: 'bg-destructive/15 text-destructive',
};

const statusLabelKeys: Record<DocumentStatus, string> = {
  draft: 'common:status.draft',
  active: 'common:status.active',
  archived: 'common:status.archived',
  expired: 'common:status.expired',
};

const importanceDotClassNames: Record<Importance, string> = {
  low: 'bg-muted-foreground',
  medium: 'bg-info',
  high: 'bg-warning',
  critical: 'bg-destructive',
};

const importanceLabelKeys: Record<Importance, string> = {
  low: 'common:priority.low',
  medium: 'common:priority.medium',
  high: 'common:priority.high',
  critical: 'common:priority.critical',
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const { t } = useTranslation(['documents', 'common']);
  return (
    <Badge variant="secondary" className={`font-medium ${statusClassNames[status]}`}>
      {t(statusLabelKeys[status])}
    </Badge>
  );
}

export function ImportanceBadge({ importance }: { importance: Importance }) {
  const { t } = useTranslation(['documents', 'common']);
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${importanceDotClassNames[importance]}`} />
      <span className="text-sm text-foreground">{t(importanceLabelKeys[importance])}</span>
    </div>
  );
}
