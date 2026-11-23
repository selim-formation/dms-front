import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { documentActivitiesApiService } from '../api/documentActivitiesApi';
import { documentActivityKeys } from '../api/documentActivityKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ActivityFilters, DocumentActivityEntry } from '../types/activity.types';

const EMPTY: DocumentActivityEntry[] = [];

/** One page of the log. Not live: refetch when the tab opens or after the user's own download / preview. */
export function useDocumentActivities(documentId: number, filters: ActivityFilters, enabled = true) {
  const tenant = useTenantId();

  const query = useQuery({
    queryKey: tenant ? documentActivityKeys.list(tenant, documentId, filters) : ['document-management', 'activities', 'pending'],
    queryFn: ({ signal }) => {
      if (!tenant) throw new Error('Tenant is required to fetch activity');
      return documentActivitiesApiService.fetchPage(tenant, documentId, filters, signal);
    },
    enabled: enabled && !!tenant,
    placeholderData: keepPreviousData,
    staleTime: 0,
    // 403 / 404 are final: retrying cannot change who you are.
    retry: (count, error) => {
      const status = (error as { status?: number })?.status;
      return status !== 403 && status !== 404 && count < 1;
    },
  });

  return {
    activities: query.data?.data ?? EMPTY,
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
