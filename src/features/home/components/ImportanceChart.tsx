import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const COLORS: Record<string, string> = {
    Critical: 'hsl(var(--destructive))',
    High: 'hsl(var(--warning))',
    Medium: 'hsl(var(--info))',
    Low: 'hsl(var(--success))',
};

export default function ImportanceChart({ data }: { data: any }) {
    const chartData = data?.total_documents_by_importance?.map((item: any) => ({
        name: item.importance,
        count: item.total_documents,
    })) || [];

    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Documents By Importance & Confidentiality</CardTitle>
                <p className="text-xs text-muted-foreground">Degree of importance distribution</p>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={32}>
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
