import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Active', value: 120 },
    { name: 'Draft', value: 35 },
    { name: 'Archived', value: 28 },
    { name: 'Expired', value: 20 },
];

const COLORS = [
    'hsl(var(--success))',
    'hsl(var(--info))',
    'hsl(var(--muted-foreground))',
    'hsl(var(--destructive))',
];

export default function StatusDistributionChart() {
    const { t } = useTranslation(['home', 'common']);
    const statusLabel: Record<string, string> = {
        Active: t('common:status.active'),
        Draft: t('common:status.draft'),
        Archived: t('common:status.archived'),
        Expired: t('common:status.expired'),
    };
    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('statusDistributionChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('statusDistributionChart.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={85}
                                dataKey="value"
                                strokeWidth={0}
                                paddingAngle={2}
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
                                    <span className="text-xs text-muted-foreground">{statusLabel[value] ?? value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
