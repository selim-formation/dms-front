import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
const data = [
  { dept: 'Departments', estates: 5, sheets: 3, others: 7 },
  { dept: 'Sales', estates: 4, sheets: 6, others: 2 },
  { dept: 'HR', estates: 3, sheets: 2, others: 4 },
  { dept: 'IT', estates: 6, sheets: 4, others: 5 },
];
export default function ExpiredByDeptGroupedChart() {
  const { t } = useTranslation(['home', 'common']);
  const legendLabels: Record<string, string> = {
    estates: t('home:expiredByDeptGroupedChart.legend.estates'),
    sheets: t('home:expiredByDeptGroupedChart.legend.sheets'),
    others: t('home:expiredByDeptGroupedChart.legend.others'),
  };
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('home:expiredByDeptGroupedChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[10px] text-muted-foreground capitalize">{legendLabels[v] ?? v}</span>} />
              <Bar dataKey="estates" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="sheets" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="others" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
