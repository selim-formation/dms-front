import { useTranslation } from 'react-i18next';

export function HomeHero() {
  const { t } = useTranslation(['home', 'common']);

  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-10 mb-8 text-primary-foreground relative overflow-hidden shadow-xl">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">{t('homeHero.title')}</h1>
        <p className="text-primary-foreground/80 mb-8 text-lg opacity-90">{t('homeHero.subtitle')}</p>

        <div className="relative group">
          <input
            className="w-full ps-12 pe-4 py-4 rounded-xl bg-card text-foreground border-none shadow-2xl focus:ring-4 focus:ring-primary/30 transition-all outline-none text-lg placeholder:text-muted-foreground"
            placeholder={t('homeHero.searchPlaceholder')}
          />
          <div className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
      <div className="absolute bottom-0 start-0 w-80 h-80 bg-black/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
    </div>
  );
}
