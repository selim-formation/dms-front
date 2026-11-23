import { memo, useMemo } from "react";
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
import { insightAxisTick, insightGridStroke } from "./insightTheme";
import { TwoLineTick } from "./insightTicks";
import { useFlatCategoryTick } from "./useFlatCategoryTick";

interface BarInsightChartProps {
  rows: InsightRow[];
  /** `horizontal` = bars grow left→right (category axis on Y), else classic columns */
  orientation?: "horizontal" | "vertical";
  isRtl?: boolean;
  /** Straight, wrapped category labels for long names (e.g. departments) */
  angleLabels?: boolean;
  /** Split "Month 2026" labels over two lines instead of slanting them */
  splitLabels?: boolean;
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
  splitLabels = false,
}: BarInsightChartProps) {
  const horizontal = orientation === "horizontal";
  const labels = useMemo(() => rows.map((r) => r.label), [rows]);
  const flat = useFlatCategoryTick(labels);
  // Straight labels get a minimum slot per bar; narrower screens scroll sideways instead of overlapping.
  const scrolls = !horizontal && angleLabels;

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden">
    <div className="h-full" style={scrolls ? { minWidth: flat.minWidth } : undefined}>
    <ResponsiveContainer width="100%" height="100%" debounce={100} onResize={flat.onResize}>
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
              tick={splitLabels ? <TwoLineTick /> : angleLabels ? flat.tick : insightAxisTick}
              axisLine={false}
              tickLine={false}
              interval={0}
              height={angleLabels || splitLabels ? flat.height : 30}
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
    </div>
    </div>
  );
}

export const BarInsightChart = memo(BarInsightChartBase);
