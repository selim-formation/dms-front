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
import { chartAxisTick, chartTooltipStyle, legendFormatter } from "./charts/chart-theme";

const data = [
  { month: "May", expired: 120, renewed: 140, others: 130 },
  { month: "Jun", expired: 135, renewed: 125, others: 145 },
  { month: "Jul", expired: 110, renewed: 150, others: 120 },
  { month: "Aug", expired: 145, renewed: 130, others: 135 },
  { month: "Sep", expired: 125, renewed: 140, others: 128 },
  { month: "Apr", expired: 130, renewed: 135, others: 140 },
];

export default function ExpiredByDeptStackedChart() {
  const { t } = useTranslation(["home", "common"]);
  const legendLabels: Record<string, string> = {
    expired: t("home:expiredByDeptStackedChart.legend.expired"),
    renewed: t("home:expiredByDeptStackedChart.legend.renewed"),
    others: t("home:expiredByDeptStackedChart.legend.others"),
  };

  return (
    <ChartCard title={t("home:expiredByDeptStackedChart.title")} height={208}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tick={chartAxisTick} axisLine={false} tickLine={false} />
          <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend iconType="circle" iconSize={6} formatter={legendFormatter(legendLabels)} />
          <Bar dataKey="expired" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="renewed" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="others" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
