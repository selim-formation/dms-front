import type { CSSProperties } from "react";

/** Categorical palette — theme tokens first, then extra hues for long lists (types/departments). */
export const INSIGHT_PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-6))",
  "hsl(24 95% 53%)",
  "hsl(173 80% 40%)",
  "hsl(231 70% 63%)",
  "hsl(84 70% 45%)",
  "hsl(330 75% 60%)",
  "hsl(199 70% 70%)",
] as const;

/** Fixed sets render by `key` so colors never shift between loads. */
export const INSIGHT_KEY_COLORS: Record<string, string> = {
  establishment: "hsl(var(--info))",
  operational: "hsl(var(--primary))",
  pending: "hsl(var(--warning))",
  approved: "hsl(var(--success))",
  rejected: "hsl(var(--destructive))",
  low: "hsl(var(--success))",
  medium: "hsl(var(--info))",
  high: "hsl(var(--warning))",
  urgent: "hsl(var(--destructive))",
};

export const INSIGHT_ONE_TIME_COLOR = "hsl(var(--info))";
export const INSIGHT_RENEWAL_COLOR = "hsl(var(--primary))";
export const INSIGHT_RISK_COLOR = "hsl(var(--destructive))";

export const insightTooltipStyle: CSSProperties = {
  borderRadius: "0.5rem",
  fontSize: "0.75rem",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  color: "hsl(var(--foreground))",
};

export const insightAxisTick = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))",
} as const;

export const insightGridStroke = "hsl(var(--border))";

export function colorForItem(key: string | null, index: number): string {
  return (key && INSIGHT_KEY_COLORS[key]) || INSIGHT_PALETTE[index % INSIGHT_PALETTE.length];
}
