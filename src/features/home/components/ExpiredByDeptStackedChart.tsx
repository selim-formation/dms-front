import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
const data = [
  { month: 'May', expired: 120, renewed: 140, others: 130 },
  { month: 'Jun', expired: 135, renewed: 125, others: 145 },
  { month: 'Jul', expired: 110, renewed: 150, others: 120 },
  { month: 'Aug', expired: 145, renewed: 130, others: 135 },
  { month: 'Sep', expired: 125, renewed: 140, others: 128 },
  { month: 'Apr', expired: 130, renewed: 135, others: 140 },
];
export default function ExpiredByDeptStackedChart() {
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Expired Documents by Dept.</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
              <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-[10px] text-muted-foreground capitalize">{v}</span>} />
              <Bar dataKey="expired" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="renewed" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="others" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
