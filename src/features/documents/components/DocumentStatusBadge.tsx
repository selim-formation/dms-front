import { Badge } from '@/shared/components/ui/badge';
import type { DocumentStatus, Importance } from '../types/index';

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  active: { label: 'Active', className: 'bg-success/15 text-success' },
  archived: { label: 'Archived', className: 'bg-secondary text-secondary-foreground' },
  expired: { label: 'Expired', className: 'bg-destructive/15 text-destructive' },
};

const importanceConfig: Record<Importance, { label: string; dotClass: string }> = {
  low: { label: 'Low', dotClass: 'bg-muted-foreground' },
  medium: { label: 'Medium', dotClass: 'bg-info' },
  high: { label: 'High', dotClass: 'bg-warning' },
  critical: { label: 'Critical', dotClass: 'bg-destructive' },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={`font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}

export function ImportanceBadge({ importance }: { importance: Importance }) {
  const config = importanceConfig[importance];
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${config.dotClass}`} />
      <span className="text-sm text-foreground">{config.label}</span>
    </div>
  );
}
