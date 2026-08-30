import { useTranslation } from 'react-i18next';
import type { HomeStatistics } from "../types/home.types";

interface StatisticsPanelProps {
  stats?: HomeStatistics;
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  const { t } = useTranslation(['home', 'common']);
  if (!stats) return null;

  return (
    <div className="bg-card rounded-xl p-8 shadow-sm border border-border mb-8 hover:shadow-lg transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-foreground border-s-4 border-primary ps-3">{t('statisticsPanel.title')}</h3>
        <select className="bg-muted border border-border text-muted-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none">
          <option>{t('statisticsPanel.last30Days')}</option>
          <option>{t('statisticsPanel.thisYear')}</option>
          <option>{t('statisticsPanel.allTime')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">{t('statisticsPanel.byCategory')}</h4>
          <div className="space-y-6">
            {stats.byCategory.map((item, i) => (
              <div key={item.category} className="group cursor-default">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-muted-foreground group-hover:text-chart-1 transition-colors">{item.category}</span>
                  <span className="font-bold text-foreground">{item.count}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-95 ${
                      i === 0 ? 'bg-chart-1' : i === 1 ? 'bg-chart-2' : i === 2 ? 'bg-chart-3' : 'bg-chart-4'
                    }`}
                    style={{ width: `${(item.count / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">{t('statisticsPanel.byDocumentType')}</h4>
           <div className="space-y-6">
            {stats.byType.map((item, i) => (
              <div key={item.type} className="group cursor-default">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-muted-foreground group-hover:text-chart-6 transition-colors">{item.type}</span>
                  <span className="font-bold text-foreground">{item.count}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-95 ${
                      i === 0 ? 'bg-chart-5' : i === 1 ? 'bg-chart-6' : i === 2 ? 'bg-chart-1' : 'bg-chart-2'
                    }`}
                    style={{ width: `${(item.count / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border">
        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-8">{t('statisticsPanel.monthlyProgress')}</h4>
        <div className="h-64 flex items-end justify-between gap-4 px-2">
           {stats.monthlyProgress.map((item) => (
             <div key={item.month} className="flex flex-col items-center gap-3 flex-1 group">
               <div className="w-full bg-muted rounded-t-xl relative h-full group-hover:bg-accent transition-colors overflow-hidden">
                  {/* Total Uploaded Bar */}
                  <div
                    className="absolute bottom-0 start-0 end-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-500"
                    style={{ height: `${(item.uploaded / 60) * 100}%` }}
                  />

                  {/* Reviewed Bar */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-primary/30 rounded-t-full group-hover:bg-primary/40 transition-colors"
                    style={{ height: `${(item.reviewed / 60) * 100}%` }}
                  />

                  {/* Approved Dot (Line) */}
                   <div
                    className="absolute w-full h-0.5 bg-primary start-0 end-0 group-hover:h-1 transition-all"
                    style={{ bottom: `${(item.approved / 60) * 100}%` }}
                  />

                  {/* Tooltip on hover (simple CSS only) */}
                  <div className="absolute top-0 start-0 end-0 bg-foreground text-background text-[10px] py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.uploaded}
                  </div>
               </div>
               <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">{item.month}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
