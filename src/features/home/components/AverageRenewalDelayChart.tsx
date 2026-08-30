import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
const data = [
  { dept: 'Commercial Dept', sales: 80, estates: 60, itOps: 40 },
  { dept: 'Finance', sales: 100, estates: 50, itOps: 70 },
  { dept: 'HR', sales: 60, estates: 90, itOps: 50 },
  { dept: 'IT', sales: 40, estates: 70, itOps: 100 },
];
export default function AverageRenewalDelayChart() {
  const { t } = useTranslation(['home', 'common']);
  const legendLabels: Record<string, string> = {
    sales: t('home:averageRenewalDelayChart.legend.sales'),
    estates: t('home:averageRenewalDelayChart.legend.estates'),
    itOps: t('home:averageRenewalDelayChart.legend.itOps'),
  };
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('home:averageRenewalDelayChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[10px] text-muted-foreground capitalize">{legendLabels[v] ?? v}</span>} />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="estates" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="itOps" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
