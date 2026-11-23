export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  destructive: "hsl(var(--destructive))",
  warning: "hsl(var(--warning))",
  info: "hsl(var(--info))",
} as const;

export const CHART_COLOR_SEQUENCE = [
  CHART_COLORS.warning,
  CHART_COLORS.success,
  CHART_COLORS.primary,
  CHART_COLORS.info,
] as const;

// eslint-disable-next-line react-refresh/only-export-components
export const chartTooltipStyle = {
  borderRadius: "0.5rem",
  fontSize: "0.7rem",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
} as const;

// eslint-disable-next-line react-refresh/only-export-components
export const chartAxisTick = { fontSize: 10 } as const;

// eslint-disable-next-line react-refresh/only-export-components
export function legendFormatter(labels: Record<string, string>) {
  return (value: string) => (
    <span className="text-[10px] text-muted-foreground capitalize">
      {labels[value] ?? value}
    </span>
  );
}
