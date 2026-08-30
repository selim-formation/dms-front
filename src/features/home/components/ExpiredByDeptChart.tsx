import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Progress } from '@/shared/components/ui/progress';
const data = [
  { dept: 'Operations', count: 5 },
  { dept: 'Finance', count: 3 },
  { dept: 'HR', count: 4 },
  { dept: 'IT', count: 2 },
];
const COLORS = ['hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--primary))', 'hsl(var(--info))'];
<<<<<<< Updated upstream
export default function ExpiredByDeptChart() {
=======

export default function ExpiredByDeptChart({ data }: { data: any }) {
  const { t } = useTranslation(['home', 'common']);
  const chartData = data?.total_expired_documents_by_departments?.map((item: any) => ({
    dept: item.department,
    count: item.total_documents,
  })) || [];

>>>>>>> Stashed changes
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('home:expiredByDeptChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                shape={(props: any) => {
                  const fill = COLORS[props.index % COLORS.length];
                  return <rect {...props} fill={fill} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground">Renewal Compliance Rate</p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">78%</span>
            <Progress value={78} className="h-2.5 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
