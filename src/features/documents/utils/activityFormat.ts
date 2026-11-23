import type { ActivityUser } from '../types/activity.types';

/** Local date + time in the interface language (Latin digits, like the rest of the UI). */
export function formatActivityDate(iso: string, language: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short', numberingSystem: 'latn' }).format(date);
}

export const initialOf = (name: string): string => name.trim().charAt(0).toUpperCase() || '?';

/** "manager · Finance, Legal" — role names are API values, shown as-is. */
export function userSubtitle(user: ActivityUser): string {
  const roles = user.roles.map((r) => r.name).join(', ');
  const departments = user.departments.map((d) => d.title).join(', ');
  return [roles, departments].filter(Boolean).join(' · ');
}
