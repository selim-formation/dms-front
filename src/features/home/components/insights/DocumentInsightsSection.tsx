import { memo } from "react";
import { cn } from "@/lib/utils";
import { useCanViewInsights } from "../../hooks/useDocumentInsight";
import {
  DistributionInsightCard,
  type DistributionInsightCardProps,
} from "./DistributionInsightCard";
import { ExpiryRiskInsightCard } from "./ExpiryRiskInsightCard";
import { InsightCard } from "./InsightCard";
import { RenewalInsightCard } from "./RenewalInsightCard";
import { useInView } from "./useInView";

type SlotConfig =
  | ({ kind: "distribution" } & Pick<
      DistributionInsightCardProps,
      | "metric"
      | "i18nKey"
      | "ownI18nKey"
      | "variant"
      | "height"
      | "translateKeysFrom"
      | "angleLabels"
    >)
  | { kind: "renewal" }
  | { kind: "expiry-risk" };

/** Every card shares one chart height so the grid reads as equal tiles. */
const CHART_HEIGHT = 340;

/** Module-level + frozen order = zero per-render allocation. 1 col mobile, 2 md, 3 lg; every card the same size. */
const SLOTS: readonly (SlotConfig & {
  id: string;
  placeholderHeight: number;
  span?: string;
})[] = [
  {
    id: "by-type",
    kind: "distribution",
    metric: "by-type",
    i18nKey: "byType",
    variant: "donut",
    height: CHART_HEIGHT,
    placeholderHeight: CHART_HEIGHT,
  },
  {
    id: "by-department",
    kind: "distribution",
    metric: "by-department",
    i18nKey: "byDepartment",
    ownI18nKey: "byDepartmentOwn",
    variant: "bar-horizontal",
    height: CHART_HEIGHT,
    placeholderHeight: CHART_HEIGHT,
  },
  {
    id: "by-category",
    kind: "distribution",
    metric: "by-category",
    i18nKey: "byCategory",
    variant: "donut",
    height: CHART_HEIGHT,
    placeholderHeight: CHART_HEIGHT,
  },
  {
    id: "by-renewal-type",
    kind: "renewal",
    span: "md:col-span-2 lg:col-span-2",
    placeholderHeight: CHART_HEIGHT,
  },
  {
    id: "by-importance",
    kind: "distribution",
    metric: "by-importance",
    i18nKey: "byImportance",
    variant: "bar-vertical",
    translateKeysFrom: "importance",
    height: CHART_HEIGHT,
    placeholderHeight: CHART_HEIGHT,
  },

  {
    id: "by-status",
    kind: "distribution",
    metric: "by-status",
    i18nKey: "byStatus",
    variant: "donut",
    height: CHART_HEIGHT,
    placeholderHeight: CHART_HEIGHT,
  },

  {
    id: "expired-by-department",
    kind: "distribution",
    metric: "expired-by-department",
    i18nKey: "expiredByDepartment",
    ownI18nKey: "expiredByDepartmentOwn",
    variant: "bar-vertical",
    angleLabels: true,
    height: CHART_HEIGHT,
    placeholderHeight: CHART_HEIGHT,
  },
  {
    id: "expiry-risk",
    kind: "expiry-risk",
    span: "md:col-span-2 lg:col-span-1",
    placeholderHeight: CHART_HEIGHT,
  },
];

/**
 * Mounts its card (and therefore fires its request + loads recharts
 * work) only once scrolled near. Until then renders a same-height
 * skeleton so layout never jumps.
 */
const InsightSlot = memo(function InsightSlot({
  slot,
}: {
  slot: (typeof SLOTS)[number];
}) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("min-w-0", slot.span)}>
      {!inView ? (
        <InsightCard title="" height={slot.placeholderHeight} isLoading />
      ) : slot.kind === "distribution" ? (
        <DistributionInsightCard
          metric={slot.metric}
          i18nKey={slot.i18nKey}
          ownI18nKey={slot.ownI18nKey}
          variant={slot.variant}
          height={slot.height}
          translateKeysFrom={slot.translateKeysFrom}
          angleLabels={slot.angleLabels}
        />
      ) : slot.kind === "renewal" ? (
        <RenewalInsightCard />
      ) : (
        <ExpiryRiskInsightCard />
      )}
    </div>
  );
});

function DocumentInsightsSectionBase() {
  // Hide for non-admin/head — the API would 403.
  const canView = useCanViewInsights();
  if (!canView) return null;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SLOTS.map((slot) => (
        <InsightSlot key={slot.id} slot={slot} />
      ))}
    </section>
  );
}

export const DocumentInsightsSection = memo(DocumentInsightsSectionBase);
export default DocumentInsightsSection;
