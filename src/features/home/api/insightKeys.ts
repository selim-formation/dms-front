/**
 * TanStack Query key factory for document insights.
 * Tenant + user (data is role-scoped) + locale (+ months) scoped — mirrors the server cache key, so
 * switching language or tenant never serves another entry's labels.
 */

import type { InsightMetric, InsightParams } from "../types/insights.types";

export const insightKeys = {
  all: (tenant: string) => ["insights", "documents", tenant] as const,
  metric: (
    tenant: string,
    userId: number | null,
    metric: InsightMetric,
    params: InsightParams,
  ) =>
    [...insightKeys.all(tenant), userId, metric, params.locale, params.months ?? null] as const,
};
