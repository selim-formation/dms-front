import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect';
import type { ActivityFilterValues } from '../../hooks/useActivityFilterState';
import type { ActivityAction, ActivitySort } from '../../types/activity.types';

export interface VersionOption {
  id: number;
  version: number;
}

interface ActivityFilterBarProps {
  values: ActivityFilterValues;
  onChange: (patch: Partial<ActivityFilterValues>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  versions: VersionOption[];
}

const ACTIONS: ActivityAction[] = ['view', 'download'];

function DateField({ label, value, min, max, onChange }: { label: string; value: string; min?: string; max?: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="shrink-0">{label}</span>
      <Input type="date" value={value} min={min} max={max} onChange={(e) => onChange(e.target.value)} className="h-10 w-auto min-w-36" />
    </label>
  );
}

function ActivityFilterBar({ values, onChange, onClear, hasActiveFilters, versions }: ActivityFilterBarProps) {
  const { t } = useTranslation('documents');

  const actionOptions = useMemo(
    () => [{ value: '' as const, label: t('activityPanel.filters.allActions') }, ...ACTIONS.map((a) => ({ value: a, label: t(`activityPanel.actions.${a}`) }))],
    [t],
  );
  const versionOptions = useMemo(
    () => [
      { value: '', label: t('activityPanel.filters.allVersions') },
      ...versions.map((v) => ({ value: String(v.id), label: t('documentVersions.title', { version: v.version }) })),
    ],
    [versions, t],
  );
  const sortOptions = useMemo(
    () => (['-created_at', 'created_at'] as const).map((s) => ({ value: s, label: t(`activityPanel.filters.sort.${s}`) })),
    [t],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={values.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder={t('activityPanel.filters.searchPlaceholder')}
            aria-label={t('activityPanel.filters.searchPlaceholder')}
            className="ps-10"
            maxLength={255}
          />
        </div>
        <DepartmentFilterSelect label={t('activityPanel.filters.action')} value={values.action} options={actionOptions} onChange={(v) => onChange({ action: v })} />
        {versions.length > 0 && (
          <DepartmentFilterSelect label={t('activityPanel.filters.version')} value={values.versionId} options={versionOptions} onChange={(v) => onChange({ versionId: v })} />
        )}
        <DepartmentFilterSelect<ActivitySort> label={t('activityPanel.filters.sortLabel')} value={values.sort} options={sortOptions} onChange={(v) => onChange({ sort: v })} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DateField label={t('activityPanel.filters.from')} value={values.from} max={values.to || undefined} onChange={(v) => onChange({ from: v })} />
        <DateField label={t('activityPanel.filters.to')} value={values.to} min={values.from || undefined} onChange={(v) => onChange({ to: v })} />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
            {t('activityPanel.filters.clear')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default memo(ActivityFilterBar);
