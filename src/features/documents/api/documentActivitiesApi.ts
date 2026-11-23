/**
 * Activity log of one document. Never cached server-side; the same user repeating an
 * action on the same version within 5 minutes is recorded once.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import type { ActivityFilters, ActivityPage, ApiEnvelope } from '../types/activity.types';

export const ACTIVITIES_PER_PAGE = 20;

/** `filter[x]` for the filters, plain `search` / `sort` / paging; empty values are left out. */
export function buildActivityParams(f: ActivityFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: f.page ?? 1,
    per_page: f.perPage ?? ACTIVITIES_PER_PAGE,
  };
  if (f.search) params.search = f.search;
  if (f.sort) params.sort = f.sort;
  if (f.action) params['filter[action]'] = f.action;
  if (f.user_id) params['filter[user_id]'] = f.user_id;
  if (f.version_id) params['filter[version_id]'] = f.version_id;
  if (f.from) params['filter[from]'] = f.from;
  if (f.to) params['filter[to]'] = f.to;
  return params;
}

export const documentActivitiesApiService = {
  async fetchPage(tenant: string, documentId: number, filters: ActivityFilters, signal?: AbortSignal): Promise<ActivityPage> {
    const res = await apiClient
      .getInstance()
      .get<ApiEnvelope<ActivityPage>>(buildApiUrl(apiEndpoints.documentActivities.list, { tenant, id: documentId }), {
        params: buildActivityParams(filters),
        signal,
      });
    return res.data.data;
  },
};
