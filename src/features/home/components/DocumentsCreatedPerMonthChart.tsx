import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Progress } from '@/shared/components/ui/progress';
const data = [
  { month: 'May', may: 18, june: 12, feb: 8 },
  { month: 'Jun', may: 22, june: 30, feb: 14 },
  { month: 'Jul', may: 15, june: 20, feb: 10 },
  { month: 'Aug', may: 28, june: 25, feb: 18 },
  { month: 'Sep', may: 20, june: 15, feb: 22 },
  { month: 'Apr', may: 35, june: 28, feb: 16 },
];
export default function DocumentsCreatedPerMonthChart() {
  const { t } = useTranslation(['home', 'common']);
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('home:documentsCreatedPerMonthChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[10px] text-muted-foreground">{v === 'may' ? t('home:documentsCreatedPerMonthChart.legend.may') : v === 'june' ? t('home:documentsCreatedPerMonthChart.legend.june') : t('home:documentsCreatedPerMonthChart.legend.feb')}</span>} />
              <Bar dataKey="may" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="june" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="feb" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground">{t('home:documentsCreatedPerMonthChart.caption')}</p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">88%</span>
            <Progress value={88} className="h-2.5 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
