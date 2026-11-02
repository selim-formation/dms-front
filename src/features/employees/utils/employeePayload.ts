/**
 * Pure helpers translating UI state into the wire format + client-side
 * checks mirroring the server rules (the server stays the authority).
 */

import type { EmployeeFilters } from '../types/employee.types';

export const EMPLOYEES_PER_PAGE = 12;
export const EMPLOYEE_NAME_MAX = 255;
export const EMPLOYEE_EMAIL_MAX = 255;

/** Pragmatic check; the server does the strict validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (value: string): boolean => EMAIL_RE.test(value);

/** Always paginates (sends `page`): without it the API returns a plain array. */
export function buildEmployeeParams(f: EmployeeFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? EMPLOYEES_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

/** "Sara Ali" → "SA"; falls back to the email's first letter. */
export function employeeInitials(name: string, email: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? email).slice(0, 2);
    return letters.toUpperCase();
}
