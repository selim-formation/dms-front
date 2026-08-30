import { useTranslation } from 'react-i18next';
import type { HomeSummary } from "../types/home.types";

interface WelcomeCardProps {
  summary?: HomeSummary;
}

export function WelcomeCard({ summary }: WelcomeCardProps) {
  const { t } = useTranslation(['home', 'common']);
  if (!summary) return null;

  const stats = [
    { label: t('welcomeCard.totalDocuments'), value: summary.totalDocuments, icon: "📄", color: "bg-chart-1/10 text-chart-1" },
    { label: t('welcomeCard.folders'), value: summary.foldersCount, icon: "📂", color: "bg-chart-3/10 text-chart-3" },
    { label: t('welcomeCard.sharedDocs'), value: summary.sharedDocsCount, icon: "🔗", color: "bg-chart-5/10 text-chart-5" },
    { label: t('welcomeCard.documentsInReview'), value: summary.inReviewCount, icon: "📝", color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="bg-card rounded-xl p-8 shadow-sm border border-border mb-8 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{t('welcomeCard.greeting', { name: 'Sarah' })}</h2>
          <p className="text-muted-foreground">{t('welcomeCard.subtitle')}</p>
        </div>
        <button className="bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors shadow-lg shadow-border">
          {t('common:actions.uploadDocument')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-2xl ${stat.color} bg-opacity-40 transition-transform hover:-translate-y-1`}>
            <div className="text-2xl mb-3 opacity-90">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1 tracking-tight text-foreground">{stat.value}</div>
            <div className="text-sm font-medium opacity-70 text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
