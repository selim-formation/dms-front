import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
<<<<<<< Updated upstream
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'تراخيص', value: 42 },
    { name: 'تصاريح', value: 31 },
    { name: 'بطاقات', value: 18 },
    { name: 'الآلات', value: 14 },
    { name: 'أذونات', value: 22 },
];
=======
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { translateDocumentTypeName } from '@/features/documents/utils/documentLabelDictionary';
import TypesChartLegendItem from './TypesChartLegendItem';
import type { StatisticsData } from '../types/statistics.types';
>>>>>>> Stashed changes

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--info))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
];

<<<<<<< Updated upstream
export default function TypesChart() {
=======
export default function TypesChart({ data }: { data: StatisticsData | undefined }) {
    const { t, i18n } = useTranslation(['home', 'common']);

    const chartData = useMemo(
        () =>
            (data?.total_documents_by_types ?? []).map((type: { type: string; total_documents: number }) => ({
                name: translateDocumentTypeName(type.type, i18n.language),
                value: type.total_documents,
            })),
        [data, i18n.language]
    );

    // First row always shows up to 2 items; remaining items flow into
    // rows of up to 3. Each row's column count matches its own item count
    // (not a fixed 3), so a trailing partial row still fills the full width
    // instead of leaving empty grid cells.
    const firstRow = chartData.slice(0, 2);
    const remainingChunks = useMemo(() => {
        const rest = chartData.slice(2);
        const chunks: typeof chartData[] = [];
        for (let i = 0; i < rest.length; i += 3) {
            chunks.push(rest.slice(i, i + 3));
        }
        return chunks;
    }, [chartData]);

    const gridColsClass = (count: number) =>
        count <= 1 ? 'grid-cols-1' : count === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3';

>>>>>>> Stashed changes
    return (
        <Card className="border-border rounded-xl h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{t('typesChart.title')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('typesChart.subtitle')}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                                nameKey="name"
                                strokeWidth={0}
                            >
<<<<<<< Updated upstream
                                {data.map((_, i) => (
=======
                                {chartData.map((_, i) => (
>>>>>>> Stashed changes
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
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {chartData.length > 0 && (
                    <div className="space-y-2">
                        {firstRow.length > 0 && (
                            <div className={`grid gap-2 ${gridColsClass(firstRow.length)}`}>
                                {firstRow.map((entry, i) => (
                                    <TypesChartLegendItem
                                        key={entry.name}
                                        color={COLORS[i % COLORS.length]}
                                        name={entry.name}
                                        value={entry.value}
                                    />
                                ))}
                            </div>
                        )}
                        {remainingChunks.map((chunk, chunkIndex) => (
                            <div key={chunkIndex} className={`grid gap-2 ${gridColsClass(chunk.length)}`}>
                                {chunk.map((entry, i) => (
                                    <TypesChartLegendItem
                                        key={entry.name}
                                        color={COLORS[(chunkIndex * 3 + i + 2) % COLORS.length]}
                                        name={entry.name}
                                        value={entry.value}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
