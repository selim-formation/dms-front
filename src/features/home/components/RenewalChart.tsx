import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
    { name: 'تراخيص', renewal: 30, oneTime: 12 },
    { name: 'تصاريح', renewal: 22, oneTime: 9 },
    { name: 'بطاقات', renewal: 10, oneTime: 8 },
    { name: 'الآلات', renewal: 6, oneTime: 8 },
    { name: 'أذونات', renewal: 14, oneTime: 8 },
];

export default function RenewalChart() {
    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Documents By Renewal & One-Time</CardTitle>
                <p className="text-xs text-muted-foreground">Document renewal classification</p>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
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
                                    <span className="text-xs text-muted-foreground">{value === 'renewal' ? 'Renewal' : 'One-Time'}</span>
                                )}
                            />
                            <Bar dataKey="renewal" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="oneTime" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
