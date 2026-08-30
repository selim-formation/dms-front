import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Progress } from '@/shared/components/ui/progress';
const data = [
  { month: 'May', high: 8, medium: 12, low: 5 },
  { month: 'Jun', high: 10, medium: 8, low: 7 },
  { month: 'Jul', high: 6, medium: 15, low: 3 },
  { month: 'Aug', high: 14, medium: 10, low: 9 },
  { month: 'Sep', high: 9, medium: 7, low: 11 },
  { month: 'Apr', high: 12, medium: 13, low: 6 },
];
export default function ExpiryRiskOverview() {
  const { t } = useTranslation(['home', 'common']);
  const legendLabels: Record<string, string> = {
    high: t('common:priority.high'),
    medium: t('common:priority.medium'),
    low: t('common:priority.low'),
  };
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('home:expiryRiskOverview.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[10px] text-muted-foreground capitalize">{legendLabels[v] ?? v}</span>} />
              <Bar dataKey="high" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="medium" fill="hsl(var(--warning))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="low" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t('home:expiryRiskOverview.itemsExpiring')}</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">9%</span>
              <Progress value={9} className="h-2 flex-1 [&>div]:bg-destructive" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t('home:expiryRiskOverview.renewalRate')}</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">78%</span>
              <Progress value={78} className="h-2 flex-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
