<<<<<<< Updated upstream
import { FileText, FolderOpen, Clock, CheckCircle } from 'lucide-react';
=======
import { useTranslation } from 'react-i18next';
import { FileText, FolderOpen, Clock } from 'lucide-react';
>>>>>>> Stashed changes
import { Card, CardContent } from '@/shared/components/ui/card';

const STATS = [
  { label: 'Total Documents', value: 203, icon: FileText, iconBg: 'bg-primary/10', iconColor: 'text-primary', change: '+12 this week' },
  { label: 'Categories', value: 8, icon: FolderOpen, iconBg: 'bg-info/10', iconColor: 'text-info', change: '4 active' },
  { label: 'Pending Reviews', value: 14, icon: Clock, iconBg: 'bg-accent/10', iconColor: 'text-accent', change: '3 urgent' },
  { label: 'Approval Rate', value: '94%', icon: CheckCircle, iconBg: 'bg-success/10', iconColor: 'text-success', change: '+2.4% vs last month' },
];

<<<<<<< Updated upstream
export default function StatsRow() {
=======
export default function StatsRow({ data }: { data: StatisticsData | undefined }) {
  const { t } = useTranslation(['home', 'common']);

  const STATS = [
    {
      label: t('statsRow.totalDocuments'),
      value: data?.total_documents ?? 0,
      icon: FileText,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      change: '+12 this week'
    },
    {
      label: t('common:common.users'),
      value: data?.total_users ?? 0,
      icon: FolderOpen,
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
      change: '4 active'
    },
    {
      label: t('statsRow.totalTasks'),
      value: data?.total_tasks ?? 0,
      icon: Clock,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      change: '3 urgent'
    },
    // { label: 'Approval Rate', value: data?.approval_rate ?? '0%', icon: CheckCircle, iconBg: 'bg-success/10', iconColor: 'text-success', change: '+2.4% vs last month' },
  ];

>>>>>>> Stashed changes
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s) => (
        <Card key={s.label} className="border-border rounded-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-6 w-6 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">{s.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
