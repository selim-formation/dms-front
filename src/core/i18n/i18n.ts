/**
 * i18next configuration - English/Arabic, RTL-aware.
 * All resources are bundled statically (small app, no need for an HTTP
 * backend); namespaces mirror the feature folder structure.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enHome from './locales/en/home.json';
import enDocuments from './locales/en/documents.json';
import enTasks from './locales/en/tasks.json';
import enTeams from './locales/en/teams.json';
import enDashboard from './locales/en/dashboard.json';
import enProfile from './locales/en/profile.json';

import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arHome from './locales/ar/home.json';
import arDocuments from './locales/ar/documents.json';
import arTasks from './locales/ar/tasks.json';
import arTeams from './locales/ar/teams.json';
import arDashboard from './locales/ar/dashboard.json';
import arProfile from './locales/ar/profile.json';

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const LANGUAGE_STORAGE_KEY = 'i18nextLng';
export const DEFAULT_NAMESPACE = 'common';

export function getLanguageDirection(lng: string): 'rtl' | 'ltr' {
  return lng.startsWith('ar') ? 'rtl' : 'ltr';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        home: enHome,
        documents: enDocuments,
        tasks: enTasks,
        teams: enTeams,
        dashboard: enDashboard,
        profile: enProfile,
      },
      ar: {
        common: arCommon,
        auth: arAuth,
        home: arHome,
        documents: arDocuments,
        tasks: arTasks,
        teams: arTeams,
        dashboard: arDashboard,
        profile: arProfile,
      },
    },
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'en',
    defaultNS: DEFAULT_NAMESPACE,
    ns: ['common', 'auth', 'home', 'documents', 'tasks', 'teams', 'dashboard', 'profile'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = getLanguageDirection(lng);
  document.documentElement.lang = lng;
});

export default i18n;
