import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { name: 'Finance', count: 38 },
    { name: 'Legal', count: 27 },
    { name: 'HR', count: 21 },
    { name: 'Engineering', count: 34 },
    { name: 'Marketing', count: 16 },
    { name: 'Operations', count: 29 },
];

export default function DepartmentsChart() {
    return (
        <Card className="border-border rounded-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Documents by Department</CardTitle>
                <p className="text-xs text-muted-foreground">Distribution across departments</p>
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
