/**
 * Pure helpers translating UI state into the wire format.
 */

import type { SectionFilters, SectionPayload } from '../types/section.types';

export const SECTIONS_PER_PAGE = 12;
export const SECTION_NAME_MAX = 255;
export const SECTION_DESCRIPTION_MAX = 1000;
export const DESCRIPTION_PREVIEW_CHARS = 50;

/** Always paginates (sends `page`) for the table; dropdowns use the lookup hook. */
export function buildSectionParams(f: SectionFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? SECTIONS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.departmentIds?.length) params['filter[department]'] = f.departmentIds.join(',');
    if (f.hasImage) params['filter[has_image]'] = 1;
    if (f.createdThisMonth) params['filter[created_this_month]'] = 1;
    return params;
}

/** Multipart body. `description=''` clears it; undefined fields are omitted. */
export function buildSectionFormData(p: SectionPayload, method?: 'PUT'): FormData {
    const fd = new FormData();
    if (p.name !== undefined) fd.append('name', p.name);
    if (p.department_id !== undefined) fd.append('department_id', String(p.department_id));
    if (p.description !== undefined) fd.append('description', p.description ?? '');
    if (p.image) fd.append('image', p.image);
    if (p.removeImage) fd.append('remove_image', '1');
    if (method) fd.append('_method', method);
    return fd;
}

export function truncate(text: string | null, max: number): string {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
