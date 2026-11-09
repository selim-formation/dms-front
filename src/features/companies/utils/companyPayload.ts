/**
 * Pure helpers: tabs, query params, slug rules, logo rules, payloads and bulk rules.
 */

import type {
    Company,
    CompanyBulkAction,
    CompanyCreatePayload,
    CompanyEditPayload,
    CompanyFilters,
    CompanyTab,
} from '../types/company.types';

export const COMPANIES_PER_PAGE = 15;
export const COMPANY_NAME_MAX = 255;
export const COMPANY_SLUG_MAX = 64;

export const TABS: CompanyTab[] = ['all', 'trash'];

export function tabFilters(tab: CompanyTab): Pick<CompanyFilters, 'trashed'> {
    return tab === 'trash' ? { trashed: 'only' } : {};
}

/** Always paginates (sends `page`); unknown params and wrong types are a 422. */
export function buildCompanyParams(f: CompanyFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? COMPANIES_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    if (f.hasLogo !== undefined) params['filter[has_logo]'] = f.hasLogo ? 1 : 0;
    if (f.createdThisMonth) params['filter[created_this_month]'] = 1;
    if (f.permissionId) params['filter[permission_id]'] = f.permissionId;
    return params;
}

// ── Slug / system id ────────────────────────────────────────────────────────

/** Lower-case letters, digits, single hyphens. */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const isValidSlug = (value: string): boolean => value.length <= COMPANY_SLUG_MAX && SLUG_RE.test(value);

/**
 * "Nile Trading!" → "nile-trading". Accents are folded; non-Latin letters are dropped,
 * so a purely Arabic name gives "" and needs an explicit slug / id.
 */
export function slugify(value: string): string {
    return value
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, COMPANY_SLUG_MAX)
        .replace(/-+$/g, '');
}

// ── Logo ────────────────────────────────────────────────────────────────────

export const LOGO_MAX_BYTES = 5 * 1024 * 1024;
/** SVG is refused by the server. */
export const LOGO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export type LogoProblem = 'type' | 'size';

export function validateLogo(file: File): LogoProblem | null {
    if (!LOGO_TYPES.includes(file.type)) return 'type';
    if (file.size < 1 || file.size > LOGO_MAX_BYTES) return 'size';
    return null;
}

// ── Display / rules ─────────────────────────────────────────────────────────

/** "Nile Trading" → "NT"; one word → its first two letters. */
export function companyInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? '?').slice(0, 2);
    return letters.toUpperCase();
}

/** `read_departments` → "read departments". */
export const humanizePermission = (name: string): string => name.replace(/_/g, ' ');

/** Order-insensitive equality of two id lists. */
export function sameIds(a: readonly number[], b: readonly number[]): boolean {
    if (a.length !== b.length) return false;
    const set = new Set(a);
    return b.every((id) => set.has(id));
}

/** Bulk actions offered in a tab, already filtered by the user's permissions. */
export function bulkActionsFor(
    tab: CompanyTab,
    can: { delete: boolean; restore: boolean; forceDelete: boolean },
): CompanyBulkAction[] {
    if (tab === 'trash') {
        return [...(can.restore ? (['restore'] as const) : []), ...(can.forceDelete ? (['force_delete'] as const) : [])];
    }
    return can.delete ? ['delete'] : [];
}

/** All-or-nothing bulk: only rows the server will accept may be selected. */
export function isSelectable(company: Company, tab: CompanyTab): boolean {
    return tab === 'trash' ? company.abilities.restore || company.abilities.force_delete : company.abilities.delete;
}

export interface CompanyFormValues {
    name: string;
    slug: string;
    id: string;
    permissionIds: number[];
}

export function initialFormValues(company: Company | null): CompanyFormValues {
    return {
        name: company?.name ?? '',
        slug: company?.slug ?? '',
        id: company?.id ?? '',
        permissionIds: company?.permission_ids ?? [],
    };
}

/** Create: slug / id are sent only when they differ from what the server would derive. */
export function buildCreatePayload(v: CompanyFormValues, logoUploadId?: string): CompanyCreatePayload {
    const name = v.name.trim();
    const slug = v.slug.trim();
    const id = v.id.trim();
    const payload: CompanyCreatePayload = { name, permissions: v.permissionIds };
    if (slug && slug !== slugify(name)) payload.slug = slug;
    if (id && id !== (slug || slugify(name))) payload.id = id;
    // Unusable derived slug (e.g. Arabic-only name): the server needs both explicitly.
    if (!slugify(name)) {
        if (slug) payload.slug = slug;
        if (id) payload.id = id;
    }
    if (logoUploadId) payload.logo_upload_id = logoUploadId;
    return payload;
}

/** Edit: features always (required), logo only when it changes. name / slug / id are never sent. */
export function buildEditPayload(
    v: CompanyFormValues,
    logo: { uploadId?: string; remove: boolean },
): CompanyEditPayload {
    const payload: CompanyEditPayload = { permissions: v.permissionIds };
    if (logo.uploadId) payload.logo_upload_id = logo.uploadId;
    else if (logo.remove) payload.remove_logo = true;
    return payload;
}
