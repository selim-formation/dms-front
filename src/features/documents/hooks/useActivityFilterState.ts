import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { ActivityAction, ActivityFilters, ActivitySort } from '../types/activity.types';

export interface ActivityFilterValues {
  search: string;
  action: ActivityAction | '';
  /** Select value: a version id as a string, or ''. */
  versionId: string;
  from: string;
  to: string;
  sort: ActivitySort;
}

const INITIAL: ActivityFilterValues = { search: '', action: '', versionId: '', from: '', to: '', sort: '-created_at' };

/** Filter + page state. Any filter change returns to page 1; `from` / `to` are kept in order. */
export function useActivityFilterState() {
  const [values, setValues] = useState<ActivityFilterValues>(INITIAL);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(values.search.trim(), 300);

  const patch = useCallback((next: Partial<ActivityFilterValues>) => {
    setValues((prev) => {
      const merged = { ...prev, ...next };
      // The API rejects `to` before `from`.
      if (merged.from && merged.to && merged.to < merged.from) {
        if ('from' in next) merged.to = merged.from;
        else merged.from = merged.to;
      }
      return merged;
    });
    setPage(1);
  }, []);

  const clear = useCallback(() => {
    setValues(INITIAL);
    setPage(1);
  }, []);

  const filters = useMemo<ActivityFilters>(
    () => ({
      search: debouncedSearch || undefined,
      action: values.action || undefined,
      version_id: values.versionId ? Number(values.versionId) : undefined,
      from: values.from || undefined,
      to: values.to || undefined,
      sort: values.sort,
      page,
    }),
    [debouncedSearch, values.action, values.versionId, values.from, values.to, values.sort, page],
  );

  const hasActiveFilters = !!(values.search || values.action || values.versionId || values.from || values.to);

  return { values, filters, page, setPage, patch, clear, hasActiveFilters };
}
