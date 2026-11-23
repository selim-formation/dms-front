import { memo } from "react";
import type { InsightRow } from "./insightRows";

interface RankedBarListProps {
  rows: InsightRow[];
}

/** One entry: name and figures on one line, a proportional bar underneath. */
const RankedBarRow = memo(function RankedBarRow({
  row,
  max,
}: {
  row: InsightRow;
  max: number;
}) {
  const width = max > 0 ? Math.max((row.total / max) * 100, row.total > 0 ? 2 : 0) : 0;

  return (
    <li className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium text-foreground" title={row.label} dir="auto">
          {row.label}
        </span>
        <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
          <span className="font-semibold text-foreground">{row.total.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">{row.percentage}%</span>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60" role="presentation">
        {/* Logical start edge: grows from the right in RTL, from the left in LTR. */}
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${width}%`, backgroundColor: row.fill }}
        />
      </div>
    </li>
  );
});

/**
 * Ranked horizontal bars as plain markup instead of a chart: names sit above their bar (no axis
 * to clip or overlap), the layout follows the page direction on its own, and long lists scroll
 * inside the card. Rows arrive already ordered by the API.
 */
function RankedBarListBase({ rows }: RankedBarListProps) {
  const max = rows.reduce((m, r) => Math.max(m, r.total), 0);

  return (
    <ul className="h-full space-y-4 overflow-y-auto pe-1" role="list">
      {rows.map((row) => (
        <RankedBarRow key={row.id} row={row} max={max} />
      ))}
    </ul>
  );
}

export const RankedBarList = memo(RankedBarListBase);
