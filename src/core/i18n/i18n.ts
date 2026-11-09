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
import enDepartments from './locales/en/departments.json';
import enTypes from './locales/en/types.json';
import enEntities from './locales/en/entities.json';
import enSections from './locales/en/sections.json';
import enProjects from './locales/en/projects.json';
import enEmployees from './locales/en/employees.json';
import enRoles from './locales/en/roles.json';
import enImports from './locales/en/imports.json';
import enManagement from './locales/en/management.json';
import enStorage from './locales/en/storage.json';
import enTaskManagement from './locales/en/taskManagement.json';
import enGalleries from './locales/en/galleries.json';
import enUsers from './locales/en/users.json';
import enCompanies from './locales/en/companies.json';

import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arHome from './locales/ar/home.json';
import arDocuments from './locales/ar/documents.json';
import arTasks from './locales/ar/tasks.json';
import arTeams from './locales/ar/teams.json';
import arDashboard from './locales/ar/dashboard.json';
import arProfile from './locales/ar/profile.json';
import arDepartments from './locales/ar/departments.json';
import arTypes from './locales/ar/types.json';
import arEntities from './locales/ar/entities.json';
import arSections from './locales/ar/sections.json';
import arProjects from './locales/ar/projects.json';
import arEmployees from './locales/ar/employees.json';
import arRoles from './locales/ar/roles.json';
import arImports from './locales/ar/imports.json';
import arManagement from './locales/ar/management.json';
import arStorage from './locales/ar/storage.json';
import arTaskManagement from './locales/ar/taskManagement.json';
import arGalleries from './locales/ar/galleries.json';
import arUsers from './locales/ar/users.json';
import arCompanies from './locales/ar/companies.json';

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
        departments: enDepartments,
        types: enTypes,
        entities: enEntities,
        sections: enSections,
        projects: enProjects,
        employees: enEmployees,
        roles: enRoles,
        imports: enImports,
        management: enManagement,
        storage: enStorage,
        taskManagement: enTaskManagement,
        galleries: enGalleries,
        users: enUsers,
        companies: enCompanies,
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
        departments: arDepartments,
        types: arTypes,
        entities: arEntities,
        sections: arSections,
        projects: arProjects,
        employees: arEmployees,
        roles: arRoles,
        imports: arImports,
        management: arManagement,
        storage: arStorage,
        taskManagement: arTaskManagement,
        galleries: arGalleries,
        users: arUsers,
        companies: arCompanies,
      },
    },
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'en',
    defaultNS: DEFAULT_NAMESPACE,
    ns: ['common', 'auth', 'home', 'documents', 'tasks', 'teams', 'dashboard', 'profile', 'departments', 'types', 'entities', 'sections', 'projects', 'employees', 'roles', 'imports', 'management', 'storage', 'taskManagement', 'galleries', 'users', 'companies'],
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
