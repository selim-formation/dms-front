/**
 * Pure helpers: wire format, system-role rules and permission grouping.
 */

import type {
    PermissionGroup,
    Role,
    RoleDeleteBlock,
    RoleFilters,
    RolePermission,
} from '../types/role.types';

export const ROLES_PER_PAGE = 12;
export const ROLE_NAME_MIN = 2;
export const ROLE_NAME_MAX = 255;

/** Names the application treats as special: never created, renamed or deleted via the API. */
export const SYSTEM_ROLES = ['admin', 'manager', 'head', 'key_user'] as const;

/**
 * Mirrors how the database compares names: case, accents, full-width letters
 * and invisible characters make no difference (`Admin`, `admín`, `ＡＤＭＩＮ`).
 */
function normalizeRoleName(name: string): string {
    return name
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\p{Cf}/gu, '')
        .trim()
        .toLowerCase();
}

const SYSTEM_ROLE_SET: ReadonlySet<string> = new Set(SYSTEM_ROLES);

export function isSystemRoleName(name: string): boolean {
    return SYSTEM_ROLE_SET.has(normalizeRoleName(name));
}

export function getDeleteBlock(role: Pick<Role, 'name' | 'users_count'>): RoleDeleteBlock | null {
    if (isSystemRoleName(role.name)) return 'system';
    if (role.users_count > 0) return 'inUse';
    return null;
}

/** Always paginates (sends `page`) — the unpaginated form returns a plain array. */
export function buildRoleParams(f: RoleFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? ROLES_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    return params;
}

/** Order-insensitive equality of two id lists. */
export function sameIds(a: readonly number[], b: readonly number[]): boolean {
    if (a.length !== b.length) return false;
    const set = new Set(a);
    return b.every((id) => set.has(id));
}

// ── Permission naming: `<action>_<resource>` (e.g. read_departments) ────────

/** Longest first so `force_delete_x` isn't read as action `force`. */
const KNOWN_ACTIONS = ['force_delete', 'restore', 'create', 'update', 'delete', 'read'] as const;
/** Display order of the groups; unknown actions follow alphabetically. */
const ACTION_ORDER = ['read', 'create', 'update', 'delete', 'restore', 'force_delete'];

export function splitPermission(name: string): { action: string; resource: string } {
    for (const action of KNOWN_ACTIONS) {
        if (name.startsWith(`${action}_`)) return { action, resource: name.slice(action.length + 1) };
    }
    const i = name.indexOf('_');
    return i === -1 ? { action: 'other', resource: name } : { action: name.slice(0, i), resource: name.slice(i + 1) };
}

export function humanize(value: string): string {
    return value.replace(/_/g, ' ');
}

function actionRank(action: string): number {
    const i = ACTION_ORDER.indexOf(action);
    return i === -1 ? ACTION_ORDER.length : i;
}

/** Groups permissions by their action prefix, each group sorted by name. */
export function groupPermissions(items: readonly RolePermission[]): PermissionGroup[] {
    const map = new Map<string, RolePermission[]>();
    for (const item of items) {
        const { action } = splitPermission(item.name);
        const bucket = map.get(action);
        if (bucket) bucket.push(item);
        else map.set(action, [item]);
    }
    return [...map.entries()]
        .sort(([a], [b]) => actionRank(a) - actionRank(b) || a.localeCompare(b))
        .map(([action, list]) => ({
            action,
            items: list.sort((a, b) => a.name.localeCompare(b.name)),
        }));
}
