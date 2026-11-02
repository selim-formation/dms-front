import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentInsight } from "../../hooks/useDocumentInsight";
import { InsightCard } from "./InsightCard";
import { RenewalInsightChart } from "./RenewalInsightChart";
import { useIsRtl } from "./useIsRtl";

interface RenewalInsightCardProps {
  className?: string;
  enabled?: boolean;
}

function RenewalInsightCardBase({ className, enabled }: RenewalInsightCardProps) {
  const { t } = useTranslation("home");
  const isRtl = useIsRtl();
  const { data, isPending, isError, refetch } = useDocumentInsight(
    "by-renewal-type",
    { enabled },
  );

  return (
    <InsightCard
      className={className}
      title={t("insights.cards.byRenewalType.title")}
      subtitle={t("insights.cards.byRenewalType.subtitle")}
      height={340}
      isLoading={isPending}
      isError={isError && !data}
      isEmpty={!!data && data.total === 0}
      onRetry={refetch}
    >
      {data && (
        <RenewalInsightChart
          items={data.items}
          oneTimeLabel={t("insights.renewal.oneTime")}
          renewalLabel={t("insights.renewal.renewal")}
          isRtl={isRtl}
        />
      )}
    </InsightCard>
  );
}

export const RenewalInsightCard = memo(RenewalInsightCardBase);
