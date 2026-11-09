/**
 * Pure helpers: tabs, query params, payload building, tones and bulk rules.
 */

import type {
    ManagedUser,
    StatusTone,
    UserBulkAction,
    UserFilters,
    UserPayload,
    UserStatus,
    UserTab,
} from '../types/user.types';

export const USERS_PER_PAGE = 15;
export const USER_NAME_MAX = 255;
export const USER_EMAIL_MAX = 255;
export const USER_PASSWORD_MIN = 8;
export const USER_PASSWORD_MAX = 255;
export const USER_ROLES_MAX = 50;

export const TABS: UserTab[] = ['all', 'active', 'inactive', 'trash'];

export function tabFilters(tab: UserTab): Pick<UserFilters, 'status' | 'trashed'> {
    if (tab === 'active' || tab === 'inactive') return { status: tab };
    if (tab === 'trash') return { trashed: 'only' };
    return {};
}

/** Always paginates (sends `page`); arrays and unknown params are a 422. */
export function buildUserParams(f: UserFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? USERS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.status) params['filter[status]'] = f.status;
    if (f.roleId) params['filter[role_id]'] = f.roleId;
    if (f.departmentId) params['filter[department_id]'] = f.departmentId;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

const STATUS_TONES: Record<UserStatus, StatusTone> = {
    active: 'success',
    inactive: 'neutral',
};

export const statusTone = (s: UserStatus | null): StatusTone => (s ? STATUS_TONES[s] : 'neutral');

/** Bulk actions offered in a tab, already filtered by the user's permissions. */
export function bulkActionsFor(
    tab: UserTab,
    can: { delete: boolean; restore: boolean; forceDelete: boolean },
): UserBulkAction[] {
    if (tab === 'trash') {
        return [...(can.restore ? (['restore'] as const) : []), ...(can.forceDelete ? (['force_delete'] as const) : [])];
    }
    return can.delete ? ['delete'] : [];
}

/** All-or-nothing bulk: only rows the server will accept may be selected (never yourself). */
export function isSelectable(user: ManagedUser, tab: UserTab, currentUserId: number | null): boolean {
    if (user.id === currentUserId) return false;
    return tab === 'trash' ? user.abilities.restore || user.abilities.force_delete : user.abilities.delete;
}

/** "Sara Ali" → "SA"; falls back to the email's first letters. */
export function userInitials(name: string, email: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? email).slice(0, 2);
    return letters.toUpperCase();
}

/** Pragmatic check; the server does the strict validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (value: string): boolean => EMAIL_RE.test(value);

/** Order-insensitive equality of two id lists. */
export function sameIds(a: readonly number[], b: readonly number[]): boolean {
    if (a.length !== b.length) return false;
    const set = new Set(a);
    return b.every((id) => set.has(id));
}

export interface UserFormValues {
    name: string;
    email: string;
    password: string;
    currentPassword: string;
    roleIds: number[];
    departmentIds: number[];
    sectionIds: number[];
}

export function initialFormValues(user: ManagedUser | null): UserFormValues {
    return {
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        currentPassword: '',
        roleIds: user?.roles.map((r) => r.id) ?? [],
        departmentIds: user?.departments.map((d) => d.id) ?? [],
        sectionIds: user?.sections.map((s) => s.id) ?? [],
    };
}

/** Create: everything the form holds. */
export function buildCreatePayload(v: UserFormValues): UserPayload {
    const payload: UserPayload = {
        name: v.name.trim(),
        email: v.email.trim(),
        password: v.password,
        roles: v.roleIds,
    };
    if (v.departmentIds.length) payload.departments = v.departmentIds;
    if (v.sectionIds.length) payload.sections = v.sectionIds;
    return payload;
}

/**
 * Edit: only what changed (a list left out stays unchanged). Yourself you may only
 * change name, email and password — roles / departments / sections are never sent.
 */
export function buildUpdatePayload(user: ManagedUser, v: UserFormValues, isSelf: boolean): UserPayload {
    const payload: UserPayload = {};
    const name = v.name.trim();
    const email = v.email.trim();
    if (name !== user.name) payload.name = name;
    if (email.toLowerCase() !== user.email.toLowerCase()) payload.email = email;
    if (v.password) {
        payload.password = v.password;
        if (isSelf) payload.current_password = v.currentPassword;
    }
    if (!isSelf) {
        if (!sameIds(v.roleIds, user.roles.map((r) => r.id))) payload.roles = v.roleIds;
        if (!sameIds(v.departmentIds, user.departments.map((d) => d.id))) payload.departments = v.departmentIds;
        if (!sameIds(v.sectionIds, user.sections.map((s) => s.id))) payload.sections = v.sectionIds;
    }
    return payload;
}
