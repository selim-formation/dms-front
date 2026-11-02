import { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { InsightLegend } from "./InsightLegend";
import { InsightTooltip } from "./InsightTooltip";
import type { InsightRow } from "./insightRows";

interface DonutInsightChartProps {
  rows: InsightRow[];
}

const TOOLTIP_CONTENT = <InsightTooltip />;

function DonutInsightChartBase({ rows }: DonutInsightChartProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" debounce={100}>
          <PieChart>
            <Pie
              data={rows}
              dataKey="total"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="90%"
              paddingAngle={rows.length > 1 ? 1 : 0}
              stroke="hsl(var(--card))"
              strokeWidth={2}
              animationDuration={500}
            >
              {rows.map((row) => (
                <Cell key={row.id} fill={row.fill} />
              ))}
            </Pie>
            <Tooltip content={TOOLTIP_CONTENT} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <InsightLegend rows={rows} />
    </div>
  );
}

export const DonutInsightChart = memo(DonutInsightChartBase);
