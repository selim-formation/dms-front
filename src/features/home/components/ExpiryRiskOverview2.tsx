import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Progress } from '@/shared/components/ui/progress';
const data = [
  { month: 'May', risk: 18 },
  { month: 'Jun', risk: 35 },
  { month: 'Jul', risk: 22 },
  { month: 'Aug', risk: 45 },
  { month: 'Sep', risk: 30 },
  { month: 'Apr', risk: 50 },
];
export default function ExpiryRiskOverview2() {
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Expiry Risk Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
              <Bar dataKey="risk" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Missing deadline</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-destructive">5%</span>
              <Progress value={5} className="h-2 flex-1 [&>div]:bg-destructive" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Renewal Compliance Rate</p>
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
