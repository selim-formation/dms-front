import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '@/core/i18n/i18n';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const nextLang: SupportedLanguage = isArabic ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(nextLang)}
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      title={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors text-xs font-bold ${className}`}
    >
      {isArabic ? 'EN' : 'ع'}
    </button>
  );
}
