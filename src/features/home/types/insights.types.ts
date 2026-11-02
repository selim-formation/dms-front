/**
 * Document Insights API types — GET /api/{tenant}/insights/documents/{metric}
 * One endpoint per dashboard chart, three response shapes.
 */

export type InsightLocale = "ar" | "en";

export interface InsightItem {
  /** Stable machine key — non-null only for fixed sets (category/status/importance) */
  key: string | null;
  label: string;
  total: number;
  percentage: number;
}

export interface DistributionInsight {
  items: InsightItem[];
  total: number;
}

export interface RenewalInsightItem {
  label: string;
  one_time: number;
  renewal: number;
  total: number;
}

export interface RenewalInsight {
  items: RenewalInsightItem[];
  total: number;
}

export interface ExpiryRiskMonth {
  label: string;
  total: number;
}

export interface ExpiryRiskInsight {
  missing_reminder_percentage: number;
  months: ExpiryRiskMonth[];
  total: number;
}

export interface InsightEnvelope<T> {
  data: T;
  message: string;
}

/** Metric slug (URL segment) → response shape */
export interface InsightMetricMap {
  "by-type": DistributionInsight;
  "by-department": DistributionInsight;
  "by-category": DistributionInsight;
  "by-renewal-type": RenewalInsight;
  "by-importance": DistributionInsight;
  "expired-by-department": DistributionInsight;
  "by-status": DistributionInsight;
  "expiry-risk": ExpiryRiskInsight;
}

export type InsightMetric = keyof InsightMetricMap;

export interface InsightParams {
  locale: InsightLocale;
  /** 1–12, only used by `expiry-risk` */
  months?: number;
}
