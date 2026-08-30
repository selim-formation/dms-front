import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { name: 'Critical', count: 24 },
    { name: 'High', count: 42 },
    { name: 'Medium', count: 35 },
    { name: 'Low', count: 18 },
];

const COLORS: Record<string, string> = {
    Critical: 'hsl(var(--destructive))',
    High: 'hsl(var(--warning))',
    Medium: 'hsl(var(--info))',
    Low: 'hsl(var(--success))',
};

<<<<<<< Updated upstream
export default function ImportanceChart() {
=======
export default function ImportanceChart({ data }: { data: any }) {
    const { t } = useTranslation(['home', 'common']);
    const chartData = data?.total_documents_by_importance?.map((item: any) => ({
        name: item.importance,
        count: item.total_documents,
    })) || [];

>>>>>>> Stashed changes
    return (
        <Card className="border-border rounded-xl h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('importanceChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('importanceChart.subtitle')}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
                <div className="h-56 w-full">
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
                                    const fill = COLORS[props.name] || 'hsl(var(--primary))';
                                    return <rect {...props} fill={fill} />;
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
