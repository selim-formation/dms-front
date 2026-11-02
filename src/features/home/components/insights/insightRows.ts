import type { InsightItem } from "../../types/insights.types";
import { colorForItem } from "./insightTheme";

/** Shape every chart consumes — built once per data/locale change in the card. */
export interface InsightRow {
  id: string;
  label: string;
  total: number;
  percentage: number;
  fill: string;
}

export function toRows(
  items: InsightItem[],
  translateKey?: (key: string, fallback: string) => string,
): InsightRow[] {
  return items.map((item, index) => {
    const label =
      item.key && translateKey ? translateKey(item.key, item.label) : item.label;
    return {
      id: item.key ?? `${item.label}-${index}`,
      label,
      total: item.total,
      percentage: item.percentage,
      fill: colorForItem(item.key, index),
    };
  });
}
