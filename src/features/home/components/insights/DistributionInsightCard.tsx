import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentInsight, useInsightScope } from "../../hooks/useDocumentInsight";
import type { InsightMetricMap } from "../../types/insights.types";
import { BarInsightChart } from "./BarInsightChart";
import { DonutInsightChart } from "./DonutInsightChart";
import { InsightCard } from "./InsightCard";
import { toRows } from "./insightRows";
import { useIsRtl } from "./useIsRtl";

type DistributionMetric = {
  [K in keyof InsightMetricMap]: InsightMetricMap[K] extends {
    items: { key: string | null }[];
  }
    ? K
    : never;
}[keyof InsightMetricMap];

export type DistributionVariant = "donut" | "bar-horizontal" | "bar-vertical";

export interface DistributionInsightCardProps {
  metric: Extract<
    DistributionMetric,
    | "by-type"
    | "by-department"
    | "by-category"
    | "by-importance"
    | "expired-by-department"
    | "by-status"
  >;
  /** i18n key under `home:insights.cards.*` */
  i18nKey: string;
  variant: DistributionVariant;
  height?: number;
  /** Alternate i18n key for manager/key_user ("your departments" wording) */
  ownI18nKey?: string;
  /** Fixed keys whose labels the API doesn't localize (importance) */
  translateKeysFrom?: string;
  angleLabels?: boolean;
  className?: string;
  enabled?: boolean;
}

function DistributionInsightCardBase({
  metric,
  i18nKey,
  ownI18nKey,
  variant,
  height = 300,
  translateKeysFrom,
  angleLabels,
  className,
  enabled,
}: DistributionInsightCardProps) {
  const { t } = useTranslation("home");
  const isRtl = useIsRtl();
  const scope = useInsightScope();
  const cardKey = scope === "own" && ownI18nKey ? ownI18nKey : i18nKey;
  const { data, isPending, isError, refetch } = useDocumentInsight(metric, {
    enabled,
  });

  const translateKey = useCallback(
    (key: string, fallback: string) =>
      translateKeysFrom
        ? t(`insights.${translateKeysFrom}.${key}`, { defaultValue: fallback })
        : fallback,
    [t, translateKeysFrom],
  );

  const rows = useMemo(
    () =>
      data ? toRows(data.items, translateKeysFrom ? translateKey : undefined) : [],
    [data, translateKey, translateKeysFrom],
  );

  const subtitleKey = `insights.cards.${cardKey}.subtitle`;

  return (
    <InsightCard
      className={className}
      title={t(`insights.cards.${cardKey}.title`)}
      subtitle={t(subtitleKey, { defaultValue: "" }) || undefined}
      height={height}
      isLoading={isPending}
      isError={isError && !data}
      isEmpty={!!data && (data.total === 0 || rows.length === 0)}
      onRetry={refetch}
    >
      {variant === "donut" ? (
        <DonutInsightChart rows={rows} />
      ) : (
        <BarInsightChart
          rows={rows}
          orientation={variant === "bar-horizontal" ? "horizontal" : "vertical"}
          isRtl={isRtl}
          angleLabels={angleLabels}
        />
      )}
    </InsightCard>
  );
}

export const DistributionInsightCard = memo(DistributionInsightCardBase);
