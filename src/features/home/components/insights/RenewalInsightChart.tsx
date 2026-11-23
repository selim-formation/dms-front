import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RenewalInsightItem } from "../../types/insights.types";
import {
  INSIGHT_ONE_TIME_COLOR,
  INSIGHT_RENEWAL_COLOR,
  insightAxisTick,
  insightGridStroke,
  insightTooltipStyle,
} from "./insightTheme";
import { useFlatCategoryTick } from "./useFlatCategoryTick";

interface RenewalInsightChartProps {
  items: RenewalInsightItem[];
  oneTimeLabel: string;
  renewalLabel: string;
  isRtl?: boolean;
}

const MARGIN = { top: 8, right: 8, bottom: 0, left: 0 };
const RADIUS: [number, number, number, number] = [3, 3, 0, 0];
const CURSOR = { fill: "hsl(var(--muted) / 0.4)" };
const LEGEND_STYLE = { fontSize: 11, paddingTop: 8 };

function RenewalInsightChartBase({
  items,
  oneTimeLabel,
  renewalLabel,
  isRtl = false,
}: RenewalInsightChartProps) {
  const labels = useMemo(() => items.map((i) => i.label), [items]);
  const flat = useFlatCategoryTick(labels);

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden">
    <div className="h-full" style={{ minWidth: flat.minWidth }}>
    <ResponsiveContainer width="100%" height="100%" debounce={100} onResize={flat.onResize}>
      <BarChart data={items} margin={MARGIN} barGap={2} barCategoryGap="20%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={insightGridStroke}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={flat.tick}
          axisLine={false}
          tickLine={false}
          interval={0}
          height={flat.height}
          reversed={isRtl}
        />
        <YAxis
          tick={insightAxisTick}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          orientation={isRtl ? "right" : "left"}
        />
        <Tooltip contentStyle={insightTooltipStyle} cursor={CURSOR} />
        <Legend
          iconType="square"
          iconSize={10}
          wrapperStyle={LEGEND_STYLE}
          verticalAlign="bottom"
        />
        <Bar
          dataKey="one_time"
          name={oneTimeLabel}
          fill={INSIGHT_ONE_TIME_COLOR}
          radius={RADIUS}
          maxBarSize={14}
          animationDuration={500}
        />
        <Bar
          dataKey="renewal"
          name={renewalLabel}
          fill={INSIGHT_RENEWAL_COLOR}
          radius={RADIUS}
          maxBarSize={14}
          animationDuration={500}
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
    </div>
  );
}

export const RenewalInsightChart = memo(RenewalInsightChartBase);
