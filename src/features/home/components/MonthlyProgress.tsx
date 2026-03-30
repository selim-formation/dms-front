import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { month: 'Aug', approvals: 8, details: 4, pending: 3 },
  { month: 'Sep', approvals: 10, details: 3, pending: 5 },
  { month: 'Jan', approvals: 12, details: 6, pending: 4 },
  { month: 'Dec', approvals: 9, details: 5, pending: 7 },
  { month: 'Feb', approvals: 13, details: 0, pending: 0 },
];

const stats = [
  { label: 'Approvals', color: 'bg-primary', curr: 43, prev: 13 },
  { label: 'Details', color: 'bg-info', curr: 0, prev: 12 },
  { label: 'Pending', color: 'bg-accent', curr: 0, prev: 12 },
];

export default function MonthlyProgress() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Monthly Progress</CardTitle>
          <span className="text-xs text-primary font-medium cursor-pointer">View all ›</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={14}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.75rem', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="approvals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="details" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
              <span className="text-muted-foreground flex-1">{s.label}</span>
              <span className={`h-1.5 flex-1 max-w-[80px] rounded-full ${s.color}`} />
              <span className="font-semibold text-foreground w-5 text-right">{s.curr}</span>
              <span className="text-muted-foreground w-5 text-right">{s.prev}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
