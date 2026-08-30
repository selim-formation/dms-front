import { useTranslation } from 'react-i18next';

export function QuickActions() {
  const { t } = useTranslation(['home', 'common']);
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8 sticky top-6">
      <h3 className="text-lg font-semibold mb-6 text-foreground flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        {t('quickActions.title')}
      </h3>
      <div className="space-y-3">
        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-muted/50 hover:bg-primary/5 hover:border-primary/20 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </div>
            <span className="font-medium text-muted-foreground group-hover:text-primary text-start">{t('quickActions.browseDocuments')}</span>
          </div>
          <span className="text-muted-foreground group-hover:text-primary">→</span>
        </button>

        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-muted/50 hover:bg-chart-5/5 hover:border-chart-5/20 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-chart-5/10 text-chart-5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
            </div>
            <span className="font-medium text-muted-foreground group-hover:text-chart-5 text-start">{t('quickActions.viewStatistics')}</span>
          </div>
          <span className="text-muted-foreground group-hover:text-chart-5">→</span>
        </button>
      </div>
    </div>
  );
}
