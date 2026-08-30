import { useTranslation } from 'react-i18next';
import type { HomeActivityItem } from "../types/home.types";

interface ActivityListProps {
  activities?: HomeActivityItem[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const { t } = useTranslation(['home', 'common']);
  if (!activities?.length) return null;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8 overflow-hidden">
       <div className="flex gap-8 border-b border-border pb-0 mb-6">
         <button className="text-primary font-semibold border-b-2 border-primary px-2 pb-4 transition-colors">{t('home:activityList.activity')}</button>
         <button className="text-muted-foreground font-medium hover:text-foreground px-2 pb-4 transition-colors">{t('home:activityList.viewedRecently')}</button>
         <button className="text-muted-foreground font-medium hover:text-foreground px-2 pb-4 transition-colors">{t('home:activityList.modifiedRecently')}</button>
       </div>

       <div className="space-y-6">
         {activities.map((item) => (
           <div key={item.id} className="flex items-center justify-between group cursor-pointer hover:bg-accent -mx-6 px-6 py-2 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
               </div>
               <div>
                 <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.documentTitle}</p>
                 <p className="text-sm text-muted-foreground mt-0.5">{item.userName} • {item.timestamp}</p>
               </div>
             </div>
             {item.status && (
               <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                 item.status === 'Active' ? 'bg-info/10 text-info' :
                 item.status === 'Approved' ? 'bg-success/10 text-success' :
                 item.status === 'Followers' ? 'bg-chart-1/10 text-chart-1' :
                 'bg-muted text-muted-foreground'
               }`}>
                 {item.status}
               </span>
             )}
           </div>
         ))}
       </div>
    </div>
  );
}
