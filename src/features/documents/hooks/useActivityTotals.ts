import { useMemo } from 'react';
import { useDocumentActivities } from './useDocumentActivities';

const ONE_ROW = { perPage: 1 } as const;
const VIEWS = { ...ONE_ROW, action: 'view' } as const;
const DOWNLOADS = { ...ONE_ROW, action: 'download' } as const;

/**
 * View / download counts for the header metrics, read from `meta.total` of a one-row page
 * (the view endpoint no longer carries the log). `forbidden` means the user may not read the
 * log at all (not the creator, manager or head): hide the tab and show no counts.
 */
export function useActivityTotals(documentId: number) {
  const views = useDocumentActivities(documentId, VIEWS);
  const downloads = useDocumentActivities(documentId, DOWNLOADS);
  const status = (views.error as { status?: number } | null)?.status;

  return useMemo(
    () => ({
      views: views.meta?.total ?? null,
      downloads: downloads.meta?.total ?? null,
      forbidden: status === 403,
      notFound: status === 404,
    }),
    [views.meta?.total, downloads.meta?.total, status],
  );
}
