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
import { chartAxisTick, chartTooltipStyle, legendFormatter } from "./charts/chart-theme";

const data = [
  { month: "May", high: 8, medium: 12, low: 5 },
  { month: "Jun", high: 10, medium: 8, low: 7 },
  { month: "Jul", high: 6, medium: 15, low: 3 },
  { month: "Aug", high: 14, medium: 10, low: 9 },
  { month: "Sep", high: 9, medium: 7, low: 11 },
  { month: "Apr", high: 12, medium: 13, low: 6 },
];

export default function ExpiryRiskOverview() {
  const { t } = useTranslation(["home", "common"]);
  const legendLabels: Record<string, string> = {
    high: t("common:priority.high"),
    medium: t("common:priority.medium"),
    low: t("common:priority.low"),
  };

  return (
    <ChartCard
      title={t("home:expiryRiskOverview.title")}
      height={176}
      footer={
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ChartProgressStat
            label={t("home:expiryRiskOverview.itemsExpiring")}
            value={9}
            progressClassName="[&>div]:bg-destructive"
          />
          <ChartProgressStat
            label={t("home:expiryRiskOverview.renewalRate")}
            value={78}
          />
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tick={chartAxisTick} axisLine={false} tickLine={false} />
          <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend iconType="circle" iconSize={6} formatter={legendFormatter(legendLabels)} />
          <Bar dataKey="high" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="medium" fill="hsl(var(--warning))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="low" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
