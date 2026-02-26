import { FileText, MoreHorizontal, Clock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/shared/components/ui/card';

const DOCS = [
  { name: 'Marketing Strategy 2024', meta: 'Dec 1 · 10 Contributors', status: 'Approved' },
  { name: 'Q1 Strategy Plan', meta: 'Dec 1 · 10 Contributors', status: 'Approved' },
  { name: 'Sales Team Allocations', meta: 'Sales · 10 Contributors', status: 'Approved' },
  { name: 'Q4 Financial Report', meta: 'Dec 1 · 10 Contributors', status: 'Draft' },
  { name: 'Product Roadmap 2024', meta: 'Dec 1 · 10 Contributors', status: 'Draft' },
];

const statusStyle: Record<string, string> = {
  Approved: 'text-success',
  Draft: 'text-muted-foreground',
};

interface Props { tenant: string }

export default function RecentDocuments({ tenant }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Recent Documents</h2>
        </div>
        <Link to={`/${tenant}/documents`} className="text-sm text-primary font-medium hover:underline">View All ›</Link>
      </div>
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {DOCS.map((doc) => (
            <div key={doc.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.meta}</p>
              </div>
              <span className={`text-xs font-semibold ${statusStyle[doc.status] ?? 'text-muted-foreground'}`}>{doc.status}</span>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
