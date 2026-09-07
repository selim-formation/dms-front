import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const KEYS = ['critical', 'high', 'medium', 'low'] as const;
const COUNTS: Record<(typeof KEYS)[number], number> = {
    critical: 24,
    high: 42,
    medium: 35,
    low: 18,
};
const COLORS: Record<(typeof KEYS)[number], string> = {
    critical: 'hsl(var(--destructive))',
    high: 'hsl(var(--warning))',
    medium: 'hsl(var(--info))',
    low: 'hsl(var(--success))',
};

export default function ImportanceChart() {
    const { t } = useTranslation(['home', 'common']);

    const data = KEYS.map((key) => ({
        key,
        name: t(`home:importanceChart.levels.${key}`),
        count: COUNTS[key],
    }));

    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('home:importanceChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('home:importanceChart.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '0.5rem',
                                    fontSize: '0.75rem',
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--background))',
                                }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[4, 4, 0, 0]}
                                shape={(props: any) => {
                                    const { x, y, width, height, payload } = props;
                                    const fill = COLORS[payload.key as (typeof KEYS)[number]] || 'hsl(var(--primary))';
                                    return <rect x={x} y={y} width={width} height={height} fill={fill} />;
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
