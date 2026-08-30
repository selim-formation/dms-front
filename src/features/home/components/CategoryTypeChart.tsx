import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
<<<<<<< Updated upstream
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
=======
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import TypesChartLegendItem from './TypesChartLegendItem';
import type { StatisticsData } from '../types/statistics.types';
>>>>>>> Stashed changes

const data = [
    { name: 'Operational', value: 68 },
    { name: 'Establishment', value: 45 },
];

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--info))',
];

<<<<<<< Updated upstream
export default function CategoryTypeChart() {
=======
export default function CategoryTypeChart({ data }: { data: StatisticsData | undefined }) {
    const { t } = useTranslation(['home', 'common']);

    const chartData = [
        { name: t('home:categoryTypeChart.operational'), value: data?.total_operational_by_percentage || 0 },
        { name: t('home:categoryTypeChart.establishment'), value: data?.total_establishment_by_percentage || 0 },
    ];
>>>>>>> Stashed changes
    return (
        <Card className="border-border rounded-xl h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('home:categoryTypeChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('home:categoryTypeChart.subtitle')}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                <div className="h-48 flex items-center justify-center">
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
                                nameKey="name"
                                strokeWidth={0}
                            >
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i]} />
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

                <div className="grid grid-cols-2 gap-2">
                    {chartData.map((entry, i) => (
                        <TypesChartLegendItem
                            key={entry.name}
                            color={COLORS[i]}
                            name={entry.name}
                            value={entry.value}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
