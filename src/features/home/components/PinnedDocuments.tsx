import { FileText, MoreVertical, Shield, BarChart3, ClipboardList, BookOpen, CheckSquare, Users } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

const PINNED = [
  { name: 'Q1 Strategy Plan', desc: 'Plans in operation and management...', tag: 'Done', tagColor: 'bg-success/15 text-success', meta: 'IT Manager', date: 'Feb 3, 2000', size: '2.5 MB', icon: ClipboardList, iconBg: 'bg-accent/20 text-accent' },
  { name: 'Product Roadmap 2024', desc: 'Plans in operation and engineering...', tag: 'Done', tagColor: 'bg-success/15 text-success', meta: '1 Image', date: 'Feb 5, 2020', size: '1.1 MB', icon: BarChart3, iconBg: 'bg-primary/15 text-primary' },
  { name: 'Annual Budget Report', desc: 'Plans in operation and finance...', tag: 'Done', tagColor: 'bg-success/15 text-success', meta: 'IT Settings', date: 'Feb 5, 2020', size: '1.3 MB', icon: Shield, iconBg: 'bg-warning/15 text-warning' },
  { name: 'Company Handbook', desc: 'Plans in operation and policies...', tag: 'Done', tagColor: 'bg-success/15 text-success', meta: 'In Review', date: 'Feb 5, 2000', size: '2.3 MB', icon: BookOpen, iconBg: 'bg-info/15 text-info' },
  { name: 'Q4 Performance Review', desc: 'Plans in operation and review...', tag: 'Done', tagColor: 'bg-success/15 text-success', meta: 'Views', date: 'Feb 3, 2000', size: '1.0 MB', icon: CheckSquare, iconBg: 'bg-success/15 text-success' },
  { name: 'Customer Survey Results', desc: 'Plans in operation and insights...', tag: 'Done', tagColor: 'bg-success/15 text-success', meta: 'In Review', date: 'Feb 5, 2020', size: '1.3 MB', icon: Users, iconBg: 'bg-destructive/15 text-destructive' },
];

interface Props { tenant: string }

export default function PinnedDocuments({ tenant }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">Pinned Documents</h2>
        <p className="text-sm text-muted-foreground">Important or frequently-used documents today.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PINNED.map((doc) => (
          <Card key={doc.name} className="border-border hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className={`flex items-center justify-between px-4 pt-4 pb-3 rounded-t-lg ${doc.iconBg.split(' ')[0]}`}>
                <doc.icon className={`h-8 w-8 ${doc.iconBg.split(' ')[1]}`} />
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="px-4 py-3 space-y-2">
                <h3 className="text-sm font-semibold text-foreground truncate">{doc.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{doc.desc}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${doc.tagColor}`}>{doc.tag}</span>
                  <span className="text-xs text-muted-foreground">{doc.meta}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                  <span>{doc.date}</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
