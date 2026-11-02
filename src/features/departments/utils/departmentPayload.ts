/**
 * Pure helpers translating UI state into the wire format the API expects.
 */

import type { DepartmentFilters, DepartmentPayload } from '../types/department.types';

export const DEPARTMENTS_PER_PAGE = 12;

/** Always paginates (sends `page`) so the server never falls back to legacy mode. */
export function buildDepartmentParams(f: DepartmentFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        include: 'sections',
        page: f.page ?? 1,
        per_page: f.perPage ?? DEPARTMENTS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    if (f.hasImage) params['filter[has_image]'] = 1;
    if (f.createdThisMonth) params['filter[created_this_month]'] = 1;
    if (f.sectionIds?.length) params['filter[sections]'] = f.sectionIds.join(',');
    return params;
}

/** Multipart body. `sections` is omitted when empty (FormData cannot carry `[]`). */
export function buildDepartmentFormData(p: DepartmentPayload, method?: 'PUT'): FormData {
    const fd = new FormData();
    if (p.title !== undefined) fd.append('title', p.title);
    if (p.image) fd.append('image', p.image);
    if (p.removeImage) fd.append('remove_image', '1');
    p.sections?.forEach((id) => fd.append('sections[]', String(id)));
    if (method) fd.append('_method', method);
    return fd;
}

export const DEPARTMENT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const DEPARTMENT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

/** Shallow set equality for id arrays (order-insensitive). */
export function sameIds(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const set = new Set(a);
    return b.every((id) => set.has(id));
}
