import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useTenantId } from "@/core/tenant/hooks/useTenant";
import { useAuthUser } from "@/core/auth/hooks/useAuthUser";
import { fetchDocumentInsight } from "../api/insights.api";
import { insightKeys } from "../api/insightKeys";
import type {
  InsightLocale,
  InsightMetric,
  InsightMetricMap,
} from "../types/insights.types";

/** Server caches each metric for 120s — polling faster gains nothing. */
const INSIGHT_STALE_MS = 120_000;

const INSIGHT_ROLES = ["admin", "head", "manager", "key_user"] as const;
/** Roles that see the whole tenant; the rest are scoped to own departments/sections. */
const FULL_SCOPE_ROLES = ["admin", "head"] as const;

/** API only knows `ar` | `en`. */
export function useInsightLocale(): InsightLocale {
  const { i18n } = useTranslation();
  return (i18n.resolvedLanguage ?? i18n.language).startsWith("ar") ? "ar" : "en";
}

/** Only admin/head/manager/key_user may call the insights API — avoids a guaranteed 403. */
export function useCanViewInsights(): boolean {
  const { data } = useAuthUser();
  return !!data?.roles?.some((r) =>
    (INSIGHT_ROLES as readonly string[]).includes(r),
  );
}

/** `own` = manager/key_user: totals cover own departments/sections only. */
export function useInsightScope(): "all" | "own" {
  const { data } = useAuthUser();
  return data?.roles?.some((r) =>
    (FULL_SCOPE_ROLES as readonly string[]).includes(r),
  )
    ? "all"
    : "own";
}

interface Options {
  /** 1–12, expiry-risk only */
  months?: number;
  /** Extra gate, e.g. wait until the card scrolls into view */
  enabled?: boolean;
}

export function useDocumentInsight<M extends InsightMetric>(
  metric: M,
  { months, enabled = true }: Options = {},
) {
  const tenant = useTenantId();
  const locale = useInsightLocale();
  const allowed = useCanViewInsights();
  const { data: me } = useAuthUser();
  // Server scopes data per role, so cache must be per user.
  const userId = me?.user.id ?? null;

  return useQuery<InsightMetricMap[M]>({
    queryKey: insightKeys.metric(tenant ?? "", userId, metric, { locale, months }),
    queryFn: ({ signal }) =>
      fetchDocumentInsight(tenant as string, metric, { locale, months }, signal),
    enabled: enabled && !!tenant && allowed,
    staleTime: INSIGHT_STALE_MS,
    refetchInterval: INSIGHT_STALE_MS,
    refetchOnWindowFocus: true,
    // Keep old chart on screen while a locale switch refetches.
    placeholderData: keepPreviousData,
    retry: (count, error) =>
      (error as { response?: { status?: number } })?.response?.status !== 403 &&
      count < 2,
  });
}
