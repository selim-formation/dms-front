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
import { chartTooltipStyle, legendFormatter } from "./charts/chart-theme";

const data = [
  { dept: "Commercial Dept", sales: 80, estates: 60, itOps: 40 },
  { dept: "Finance", sales: 100, estates: 50, itOps: 70 },
  { dept: "HR", sales: 60, estates: 90, itOps: 50 },
  { dept: "IT", sales: 40, estates: 70, itOps: 100 },
];

export default function AverageRenewalDelayChart() {
  const { t } = useTranslation(["home", "common"]);
  const legendLabels: Record<string, string> = {
    sales: t("home:averageRenewalDelayChart.legend.sales"),
    estates: t("home:averageRenewalDelayChart.legend.estates"),
    itOps: t("home:averageRenewalDelayChart.legend.itOps"),
  };

  return (
    <ChartCard title={t("home:averageRenewalDelayChart.title")} height={208}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="dept" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend iconType="circle" iconSize={6} formatter={legendFormatter(legendLabels)} />
          <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="estates" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="itOps" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
