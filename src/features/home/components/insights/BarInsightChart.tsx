import { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InsightTooltip } from "./InsightTooltip";
import type { InsightRow } from "./insightRows";
import {
  insightAxisTick,
  insightGridStroke,
} from "./insightTheme";

interface BarInsightChartProps {
  rows: InsightRow[];
  /** `horizontal` = bars grow left→right (category axis on Y), else classic columns */
  orientation?: "horizontal" | "vertical";
  isRtl?: boolean;
  /** Slanted category labels for long names (e.g. departments) */
  angleLabels?: boolean;
}

const TOOLTIP_CONTENT = <InsightTooltip />;
const CURSOR = { fill: "hsl(var(--muted) / 0.4)" };
const MARGIN = { top: 8, right: 8, bottom: 0, left: 0 };
const HORIZONTAL_RADIUS: [number, number, number, number] = [0, 4, 4, 0];
const VERTICAL_RADIUS: [number, number, number, number] = [4, 4, 0, 0];

function BarInsightChartBase({
  rows,
  orientation = "vertical",
  isRtl = false,
  angleLabels = false,
}: BarInsightChartProps) {
  const horizontal = orientation === "horizontal";

  return (
    <ResponsiveContainer width="100%" height="100%" debounce={100}>
      <BarChart
        data={rows}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={MARGIN}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={insightGridStroke}
          vertical={horizontal}
          horizontal={!horizontal}
        />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tick={insightAxisTick}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              reversed={isRtl}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={100}
              tick={insightAxisTick}
              axisLine={false}
              tickLine={false}
              interval={0}
              orientation={isRtl ? "right" : "left"}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="label"
              tick={insightAxisTick}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={angleLabels ? -45 : 0}
              textAnchor={angleLabels ? "end" : "middle"}
              height={angleLabels ? 80 : 30}
              reversed={isRtl}
            />
            <YAxis
              tick={insightAxisTick}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              orientation={isRtl ? "right" : "left"}
            />
          </>
        )}
        <Tooltip content={TOOLTIP_CONTENT} cursor={CURSOR} />
        <Bar
          dataKey="total"
          radius={horizontal ? HORIZONTAL_RADIUS : VERTICAL_RADIUS}
          maxBarSize={horizontal ? 18 : 56}
          animationDuration={500}
        >
          {rows.map((row) => (
            <Cell key={row.id} fill={row.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export const BarInsightChart = memo(BarInsightChartBase);
