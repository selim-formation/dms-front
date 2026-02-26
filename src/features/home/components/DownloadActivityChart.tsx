import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle } from 'lucide-react';
const data = [
  { name: 'Operations', value: 30, color: 'hsl(var(--success))' },
  { name: 'Finance', value: 25, color: 'hsl(var(--warning))' },
  { name: 'HR', value: 20, color: 'hsl(var(--primary))' },
  { name: 'Sales', value: 15, color: 'hsl(var(--destructive))' },
  { name: 'IT', value: 10, color: 'hsl(var(--info))' },
];
export default function DownloadActivityChart() {
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Download Activity by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="flex flex-col gap-1.5">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-44 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '0.5rem', fontSize: '0.7rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} />
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold" fill="hsl(var(--foreground))">78%</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="font-semibold text-foreground">78%</span>
          <span className="text-muted-foreground">Renewal Compliant</span>
        </div>
      </CardContent>
    </Card>
  );
}
