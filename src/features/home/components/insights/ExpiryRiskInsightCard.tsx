import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentInsight, useInsightLocale } from "../../hooks/useDocumentInsight";
import { BarInsightChart } from "./BarInsightChart";
import { InsightCard } from "./InsightCard";
import type { InsightRow } from "./insightRows";
import { INSIGHT_RISK_COLOR } from "./insightTheme";
import { localizeMonth } from "./formatInsight";
import { useIsRtl } from "./useIsRtl";

/** Months window — API accepts 1–12, default 6 */
const RISK_MONTHS = 6;

interface ExpiryRiskInsightCardProps {
  className?: string;
  enabled?: boolean;
}

function ExpiryRiskInsightCardBase({ className, enabled }: ExpiryRiskInsightCardProps) {
  const { t } = useTranslation("home");
  const locale = useInsightLocale();
  const isRtl = useIsRtl();
  const { data, isPending, isError, refetch } = useDocumentInsight("expiry-risk", {
    months: RISK_MONTHS,
    enabled,
  });

  const rows = useMemo<InsightRow[]>(() => {
    if (!data) return [];
    return data.months.map((m) => ({
      id: m.label,
      label: localizeMonth(m.label, locale),
      total: m.total,
      percentage: data.total ? Math.round((m.total / data.total) * 1000) / 10 : 0,
      fill: INSIGHT_RISK_COLOR,
    }));
  }, [data, locale]);

  return (
    <InsightCard
      className={className}
      title={t("insights.cards.expiryRisk.title")}
      subtitle={
        data
          ? t("insights.cards.expiryRisk.subtitle", {
              percentage: data.missing_reminder_percentage,
            })
          : undefined
      }
      height={340}
      isLoading={isPending}
      isError={isError && !data}
      isEmpty={!!data && data.total === 0}
      onRetry={refetch}
    >
      <BarInsightChart rows={rows} orientation="vertical" isRtl={isRtl} splitLabels />
    </InsightCard>
  );
}

export const ExpiryRiskInsightCard = memo(ExpiryRiskInsightCardBase);
