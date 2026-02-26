import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const CATEGORIES = [
  { name: 'Contracts', value: 47, color: 'bg-primary' },
  { name: 'Reports', value: 26, color: 'bg-info' },
  { name: 'Legal', value: 13, color: 'bg-accent' },
  { name: 'Certificates', value: 14, color: 'bg-destructive' },
];

export default function DocumentStatistics() {
  const max = Math.max(...CATEGORIES.map(c => c.value));
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Document Statistics</CardTitle>
        <p className="text-xs text-muted-foreground">By Category</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20 shrink-0">{cat.name}</span>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${cat.color} transition-all`} style={{ width: `${(cat.value / max) * 100}%` }} />
            </div>
            <span className="text-xs font-semibold text-foreground w-6 text-right">{cat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
