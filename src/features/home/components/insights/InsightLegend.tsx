import { memo } from "react";
import type { InsightRow } from "./insightRows";

interface InsightLegendProps {
  rows: InsightRow[];
}

function InsightLegendBase({ rows }: InsightLegendProps) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 px-2 pt-2">
      {rows.map((row) => (
        <li
          key={row.id}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          <span
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: row.fill }}
            aria-hidden
          />
          {row.label}
        </li>
      ))}
    </ul>
  );
}

export const InsightLegend = memo(InsightLegendBase);
