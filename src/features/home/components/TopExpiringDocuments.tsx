import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileText } from 'lucide-react';
const docs = [
  { name: 'IT Strategy Plan', days: 5, color: 'hsl(var(--destructive))' },
  { name: 'Fleet Service Permits', days: 7, color: 'hsl(var(--warning))' },
  { name: 'Product Roadmap 2024', days: 10, color: 'hsl(var(--warning))' },
  { name: 'Vendor Contracts', days: 12, color: 'hsl(var(--info))' },
  { name: 'Lease Agreement', days: 14, color: 'hsl(var(--info))' },
];
export default function TopExpiringDocuments() {
  const { t } = useTranslation(['home', 'common']);
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('topExpiringDocuments.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <FileText className="h-4 w-4 flex-shrink-0" style={{ color: doc.color }} />
              <span className="flex-1 text-foreground truncate">{doc.name}</span>
              <span className="text-xs font-semibold text-muted-foreground">{t('topExpiringDocuments.daysCount', { count: doc.days })}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}