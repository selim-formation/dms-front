import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ChartCard from "./charts/ChartCard";
import ChartProgressStat from "./charts/ChartProgressStat";
import {
  CHART_COLOR_SEQUENCE,
  chartAxisTick,
  chartTooltipStyle,
} from "./charts/chart-theme";

const data = [
  { dept: "Operations", count: 5 },
  { dept: "Finance", count: 3 },
  { dept: "HR", count: 4 },
  { dept: "IT", count: 2 },
];

export default function ExpiredByDeptChart() {
  const { t } = useTranslation(["home", "common"]);

  return (
    <ChartCard
      title={t("home:expiredByDeptChart.title")}
      height={176}
      footer={
        <div className="mt-3">
          <ChartProgressStat
            label={t("home:expiredByDeptChart.renewalComplianceRate")}
            value={78}
          />
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={24}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="dept"
            tick={chartAxisTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            shape={(props: any) => {
              const fill = CHART_COLOR_SEQUENCE[props.index % CHART_COLOR_SEQUENCE.length];
              return <rect {...props} fill={fill} />;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
