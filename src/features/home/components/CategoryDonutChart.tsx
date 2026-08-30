import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--info))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
];

export default function CategoryDonutChart() {
    const { t } = useTranslation(['home', 'common']);
    const data = [
        { name: t('home:categoryDonutChart.categories.contracts'), value: 47 },
        { name: t('home:categoryDonutChart.categories.reports'), value: 26 },
        { name: t('home:categoryDonutChart.categories.legal'), value: 13 },
        { name: t('home:categoryDonutChart.categories.certificates'), value: 14 },
    ];
    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('home:categoryDonutChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('home:categoryDonutChart.subtitle')}</p>
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
