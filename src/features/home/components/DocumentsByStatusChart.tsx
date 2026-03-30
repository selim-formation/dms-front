import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
const LABEL_TYPES: Record<string, string> = {
  approved: 'documents',
  rejected: 'documents',
  pending: 'documents',
};
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value }: any) => {
  const RADIAN = Math.PI / 180;
  const x = cx + (outerRadius + 22) * Math.cos(-midAngle * RADIAN);
  const y = cy + (outerRadius + 22) * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fill="hsl(var(--foreground))">
      {value}
    </text>
  );
};
export default function DocumentsByStatusChart({ data }: { data: any }) {
  const chartData = data?.total_documents_by_status?.map((item: { status: string; total_documents: number }) => ({
    name: item.status,
    count: item.total_documents,
    color:
      item.status === 'approved'
        ? 'hsl(var(--success))'
        : item.status === 'rejected'
          ? 'hsl(var(--destructive))'
          : item.status === 'pending'
            ? 'hsl(var(--info))'
            : 'hsl(var(--muted))',
  })) || [];


  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Documents by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
                strokeWidth={0}
                label={renderCustomLabel}
                labelLine={false}
              >
                {chartData.map((_entry: any, i: number) => (
                  <Cell key={i} fill={_entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--background))',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-1.5">
          {chartData?.map((item: any) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-foreground font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">{item.count}</span>
                <span className="text-muted-foreground">({LABEL_TYPES[item.name]})</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
