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
  { dept: "Departments", estates: 5, sheets: 3, others: 7 },
  { dept: "Sales", estates: 4, sheets: 6, others: 2 },
  { dept: "HR", estates: 3, sheets: 2, others: 4 },
  { dept: "IT", estates: 6, sheets: 4, others: 5 },
];

export default function ExpiredByDeptGroupedChart() {
  const { t } = useTranslation(["home", "common"]);
  const legendLabels: Record<string, string> = {
    estates: t("home:expiredByDeptGroupedChart.legend.estates"),
    sheets: t("home:expiredByDeptGroupedChart.legend.sheets"),
    others: t("home:expiredByDeptGroupedChart.legend.others"),
  };

  return (
    <ChartCard title={t("home:expiredByDeptGroupedChart.title")} height={208}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="dept" tick={chartAxisTick} axisLine={false} tickLine={false} />
          <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend iconType="circle" iconSize={6} formatter={legendFormatter(legendLabels)} />
          <Bar dataKey="estates" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="sheets" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="others" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
