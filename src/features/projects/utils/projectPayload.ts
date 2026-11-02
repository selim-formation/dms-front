/**
 * Pure helpers translating UI state into the wire format + client-side
 * checks mirroring the server rules (the server stays the authority: it
 * validates the file's real content).
 */

import type { ProjectFilters, ProjectPayload } from '../types/project.types';

export const PROJECTS_PER_PAGE = 12;
export const PROJECT_NAME_MAX = 255;
export const PROJECT_DESCRIPTION_MAX = 1000;
export const PROJECT_CATEGORY_MAX = 50;
export const PROJECT_MANAGER_MAX = 255;
export const PROJECT_DURATION_MAX = 2147483647;

export const PROJECT_FILE_MAX_BYTES = 100000 * 1024;
export const PROJECT_FILE_EXTENSIONS = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf', 'odt', 'ods', 'zip', 'jpg', 'jpeg', 'png', 'gif',
] as const;
export const PROJECT_FILE_ACCEPT = PROJECT_FILE_EXTENSIONS.map((e) => `.${e}`).join(',');

export type ProjectFileError = 'type' | 'size';

/** Quick browser-side check by extension and size. */
export function checkProjectFile(file: File): ProjectFileError | null {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!(PROJECT_FILE_EXTENSIONS as readonly string[]).includes(ext)) return 'type';
    if (file.size > PROJECT_FILE_MAX_BYTES) return 'size';
    return null;
}

/** Always paginates (sends `page`) so the response is the paginated payload. */
export function buildProjectParams(f: ProjectFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? PROJECTS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    // Comma separated WITHOUT spaces; arrays would be a 422.
    if (f.status?.length) params['filter[status]'] = f.status.join(',');
    if (f.type?.length) params['filter[type]'] = f.type.join(',');
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

/** Multipart body: `null` becomes an empty value (clears the field), `undefined` is skipped. */
export function buildProjectFormData(p: ProjectPayload, method?: 'PUT'): FormData {
    const fd = new FormData();
    (Object.keys(p) as (keyof ProjectPayload)[]).forEach((key) => {
        const value = p[key];
        if (value === undefined) return;
        if (value instanceof File) fd.append(key, value);
        else fd.append(key, value === null ? '' : String(value));
    });
    if (method) fd.append('_method', method);
    return fd;
}

/** `YYYY-MM-DD` → localised date, parsed as a local date to avoid timezone shifts. */
export function formatProjectDate(value: string | null, locale: string): string | null {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return value;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(y, m - 1, d));
}

export function truncate(text: string | null, max: number): string {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
