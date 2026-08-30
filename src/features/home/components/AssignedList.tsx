import { useTranslation } from 'react-i18next';
import type { AssignedItem } from "../types/home.types";

interface AssignedListProps {
  tasks?: AssignedItem[];
}

export function AssignedList({ tasks }: AssignedListProps) {
  const { t } = useTranslation(['home', 'common']);
  if (!tasks?.length) return null;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground border-s-4 border-warning ps-3">{t('home:assignedList.title')}</h3>
        <span className="text-sm font-semibold bg-warning/10 text-warning px-3 py-1 rounded-full">{t('home:assignedList.pendingCount', { count: tasks.length })}</span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border hover:border-warning/40 hover:shadow-sm transition-all bg-card group hover:bg-warning/5">
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
              </div>
              <div>
                <p className="font-semibold text-foreground group-hover:text-warning transition-colors">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {t('home:assignedList.due', { date: task.dueDate })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 ps-16 sm:ps-0">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                task.priority === 'High' ? 'bg-destructive/10 text-destructive' :
                task.priority === 'Medium' ? 'bg-warning/10 text-warning' :
                'bg-success/10 text-success'
              }`}>
                {task.priority}
              </span>
              <button className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all">
                {t('home:assignedList.review')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
