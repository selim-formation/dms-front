/**
 * Sets `dir`/`lang` on <html> synchronously before React mounts (and before
 * i18next itself finishes initializing) so there is no flash of the wrong
 * text direction on load. Mirrors src/core/theme/applyInitialTheme.ts.
 */
import { LANGUAGE_STORAGE_KEY, getLanguageDirection, type SupportedLanguage } from './i18n';

function getStoredLanguage(): SupportedLanguage {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'ar' || stored === 'en') return stored;

  const browserLang = window.navigator.language?.slice(0, 2);
  return browserLang === 'ar' ? 'ar' : 'en';
}

export function applyInitialDirection(): void {
  const lng = getStoredLanguage();
  document.documentElement.dir = getLanguageDirection(lng);
  document.documentElement.lang = lng;
}
