/**
 * Document insights API service — read-only GETs, admin/head only.
 */

import { apiClient } from "@/core/api/client";
import { apiEndpoints, buildApiUrl } from "@/config/api.config";
import type {
  InsightEnvelope,
  InsightMetric,
  InsightMetricMap,
  InsightParams,
} from "../types/insights.types";

export async function fetchDocumentInsight<M extends InsightMetric>(
  tenant: string,
  metric: M,
  { locale, months }: InsightParams,
  signal?: AbortSignal,
): Promise<InsightMetricMap[M]> {
  const url = buildApiUrl(apiEndpoints.insights.documents, { tenant, metric });
  const { data } = await apiClient
    .getInstance()
    .get<InsightEnvelope<InsightMetricMap[M]>>(url, {
      // API ignores Accept-Language — locale must be explicit.
      params: { locale, months: metric === "expiry-risk" ? months : undefined },
      headers: { Accept: "application/json" },
      signal,
    });

  return data.data;
}
