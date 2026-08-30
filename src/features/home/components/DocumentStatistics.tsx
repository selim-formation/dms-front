import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function DocumentStatistics() {
  const { t } = useTranslation(['home', 'common']);
  const CATEGORIES = [
    { name: t('home:documentStatistics.categories.contracts'), value: 47, color: 'bg-primary' },
    { name: t('home:documentStatistics.categories.reports'), value: 26, color: 'bg-info' },
    { name: t('home:documentStatistics.categories.legal'), value: 13, color: 'bg-accent' },
    { name: t('home:documentStatistics.categories.certificates'), value: 14, color: 'bg-destructive' },
  ];
  const max = Math.max(...CATEGORIES.map(c => c.value));
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{t('home:documentStatistics.title')}</CardTitle>
        <p className="text-xs text-muted-foreground">{t('home:documentStatistics.subtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20 shrink-0">{cat.name}</span>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${cat.color} transition-all`} style={{ width: `${(cat.value / max) * 100}%` }} />
            </div>
            <span className="text-xs font-semibold text-foreground w-6 text-end">{cat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
