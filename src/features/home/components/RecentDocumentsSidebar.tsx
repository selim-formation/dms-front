import { FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const DOCS = [
  { name: 'Marketing Strategy 2024', meta: 'Dec 1 · 7 Contributors', time: '' },
  { name: 'Q1 Strategy Plan', meta: 'Sales · 3 Contributors', time: '23m ago' },
  { name: 'Sales Team Allocations', meta: 'Sales · 10 Contributors', time: '1m ago' },
  { name: 'Q4 Financial Report', meta: 'Dec 1 · 10 Contributors', time: '1-day ago' },
  { name: 'Product Roadmap 2024', meta: 'Tech · 5 Contributors', time: '' },
];

interface Props { tenant: string }

export default function RecentDocumentsSidebar({ tenant }: Props) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Recent Documents</CardTitle>
          <Link to={`/${tenant}/documents`} className="text-xs text-primary font-medium hover:underline">View All ›</Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-border">
        {DOCS.map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground">{doc.meta}</p>
            </div>
            {doc.time && <span className="text-[11px] text-muted-foreground whitespace-nowrap">{doc.time}</span>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
