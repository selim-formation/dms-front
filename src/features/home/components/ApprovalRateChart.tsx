import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { month: 'Aug', rate: 88 },
    { month: 'Sep', rate: 91 },
    { month: 'Oct', rate: 85 },
    { month: 'Nov', rate: 93 },
    { month: 'Dec', rate: 90 },
    { month: 'Jan', rate: 94 },
    { month: 'Feb', rate: 96 },
];

export default function ApprovalRateChart() {
    const { t } = useTranslation(['home', 'common']);
    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('home:approvalRateChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('home:approvalRateChart.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '0.5rem',
                                    fontSize: '0.75rem',
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--background))',
                                }}
                                formatter={(value: number | undefined) => [`${value ?? ''}%`, t('home:approvalRateChart.title')] as [string, string]}
                            />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="hsl(var(--success))"
                                strokeWidth={2.5}
                                dot={{ fill: 'hsl(var(--success))', r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
