import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
<<<<<<< Updated upstream
const data = [
  { name: 'Active', value: 110, color: 'hsl(var(--success))' },
  { name: 'Expiring Soon', value: 99, color: 'hsl(var(--warning))' },
  { name: 'Expired', value: 10, color: 'hsl(var(--destructive))' },
  { name: 'Archived', value: 44, color: 'hsl(var(--info))' },
  { name: 'Under Review', value: 17, color: 'hsl(var(--primary))' },
];
const LABEL_TYPES: Record<string, string> = {
  Active: 'documents',
  'Expiring Soon': 'documents',
  Expired: 'documents',
  Archived: 'documents',
  'Under Review': 'documents',
};
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value }: any) => {
=======
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value }: any) => {
>>>>>>> Stashed changes
  const RADIAN = Math.PI / 180;
  const x = cx + (outerRadius + 22) * Math.cos(-midAngle * RADIAN);
  const y = cy + (outerRadius + 22) * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fill="hsl(var(--foreground))">
      {value}
    </text>
  );
};
<<<<<<< Updated upstream
export default function DocumentsByStatusChart() {
=======
export default function DocumentsByStatusChart({ data }: { data: any }) {
  const { t } = useTranslation(['home', 'common']);
  const statusLabel = (status: string) => t(`common:status.${status}`, { defaultValue: status });
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


>>>>>>> Stashed changes
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('home:documentsByStatusChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                label={renderCustomLabel}
                labelLine={false}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
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
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-foreground font-medium">{statusLabel(item.name)}</span>
              </div>
              <div className="flex items-center gap-1.5">
<<<<<<< Updated upstream
                <span className="font-semibold text-foreground">{item.value}</span>
                <span className="text-muted-foreground">({LABEL_TYPES[item.name]})</span>
=======
                <span className="font-semibold text-foreground">{item.count}</span>
                <span className="text-muted-foreground">({t('home:documentsByStatusChart.unit')})</span>
>>>>>>> Stashed changes
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
