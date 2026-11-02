import { memo } from "react";
import type { TooltipContentProps } from "recharts";
import { insightTooltipStyle } from "./insightTheme";

/**
 * Shows server-computed `percentage` instead of recomputing client-side.
 * Reads label/total/percentage from the hovered row payload.
 */
function InsightTooltipBase({
  active,
  payload,
}: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as {
    label: string;
    total: number;
    percentage?: number;
  };

  return (
    <div style={insightTooltipStyle} className="px-3 py-2 shadow-md">
      <p className="font-semibold">{row.label}</p>
      <p className="text-muted-foreground">
        {row.total.toLocaleString()}
        {row.percentage !== undefined ? ` · ${row.percentage}%` : null}
      </p>
    </div>
  );
}

export const InsightTooltip = memo(InsightTooltipBase);
