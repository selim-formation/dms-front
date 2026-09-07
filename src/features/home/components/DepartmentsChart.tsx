import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export default function DepartmentsChart() {
    const { t } = useTranslation(['home', 'common']);

    const data = [
        { name: t('home:departmentsChart.departments.finance'), count: 38 },
        { name: t('home:departmentsChart.departments.legal'), count: 27 },
        { name: t('home:departmentsChart.departments.hr'), count: 21 },
        { name: t('home:departmentsChart.departments.engineering'), count: 34 },
        { name: t('home:departmentsChart.departments.marketing'), count: 16 },
        { name: t('home:departmentsChart.departments.operations'), count: 29 },
    ];

    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('home:departmentsChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('home:departmentsChart.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={24} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '0.5rem',
                                    fontSize: '0.75rem',
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--background))',
                                }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
