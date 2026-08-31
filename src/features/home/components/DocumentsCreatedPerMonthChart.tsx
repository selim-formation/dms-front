import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import ChartCard from "./charts/ChartCard";
import ChartProgressStat from "./charts/ChartProgressStat";
import {
  CHART_COLORS,
  chartAxisTick,
  chartTooltipStyle,
  legendFormatter,
} from "./charts/chart-theme";

const data = [
  { month: "May", may: 18, june: 12, feb: 8 },
  { month: "Jun", may: 22, june: 30, feb: 14 },
  { month: "Jul", may: 15, june: 20, feb: 10 },
  { month: "Aug", may: 28, june: 25, feb: 18 },
  { month: "Sep", may: 20, june: 15, feb: 22 },
  { month: "Apr", may: 35, june: 28, feb: 16 },
];

export default function DocumentsCreatedPerMonthChart() {
  const { t } = useTranslation(["home", "common"]);
  const legendLabels: Record<string, string> = {
    may: t("home:documentsCreatedPerMonthChart.legend.may"),
    june: t("home:documentsCreatedPerMonthChart.legend.june"),
    feb: t("home:documentsCreatedPerMonthChart.legend.feb"),
  };

  return (
    <ChartCard
      title={t("home:documentsCreatedPerMonthChart.title")}
      height={176}
      footer={
        <div className="mt-3">
          <ChartProgressStat
            label={t("home:documentsCreatedPerMonthChart.caption")}
            value={88}
          />
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={8}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={chartAxisTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend
            iconType="circle"
            iconSize={6}
            formatter={legendFormatter(legendLabels)}
          />
          <Bar dataKey="may" fill={CHART_COLORS.primary} radius={[2, 2, 0, 0]} />
          <Bar dataKey="june" fill={CHART_COLORS.success} radius={[2, 2, 0, 0]} />
          <Bar dataKey="feb" fill={CHART_COLORS.destructive} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
