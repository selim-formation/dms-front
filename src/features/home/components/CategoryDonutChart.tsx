import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Contracts', value: 47 },
    { name: 'Reports', value: 26 },
    { name: 'Legal', value: 13 },
    { name: 'Certificates', value: 14 },
];

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--info))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
];

export default function CategoryDonutChart() {
    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Documents by Category</CardTitle>
                <p className="text-xs text-muted-foreground">Distribution across categories</p>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                formatter={(value) => (
                                    <span className="text-xs text-muted-foreground">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
