/**
 * Pure helpers: limits, query params, file validation, formatting, blob saving.
 */

import type {
    CreateImportPayload,
    ImportFilters,
    RowFilters,
    UploadKind,
} from '../types/import.types';

export const IMPORTS_PER_PAGE = 15;
export const ROWS_PER_PAGE = 20;
export const IMPORT_NAME_MAX = 150;
export const MAX_DEFAULT_IDS = 100;

export const LIST_POLL_MS = 5_000;
export const DETAIL_POLL_MS = 3_000;
export const UPLOAD_POLL_MS = 1_500;
export const UPLOAD_CONCURRENCY = 4;
export const UPLOAD_MAX_ATTEMPTS = 4;

export const FILE_RULES: Record<UploadKind, { ext: string; maxBytes: number; accept: string }> = {
    archive: { ext: '.zip', maxBytes: 20 * 1024 ** 3, accept: '.zip,application/zip' },
    manifest: { ext: '.csv', maxBytes: 20 * 1024 ** 2, accept: '.csv,text/csv' },
    /** Any extension except ones a web server executes; 200 MB each. */
    document_file: { ext: '', maxBytes: 200 * 1024 ** 2, accept: '' },
};

/** Client-side mirror of the server's block list (also catches `shell.php.jpg`). */
const EXECUTABLE_EXTENSIONS = new Set([
    'php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'phps', 'phar', 'asp', 'aspx', 'ashx', 'jsp', 'jspx', 'cgi', 'pl',
]);
export const hasExecutableExtension = (name: string): boolean =>
    name.toLowerCase().split('.').slice(1).some((part) => EXECUTABLE_EXTENSIONS.has(part));

export type FileProblem = 'extension' | 'empty' | 'tooLarge' | 'blocked';

export function validateFile(kind: UploadKind, file: File): FileProblem | null {
    const rule = FILE_RULES[kind];
    if (kind === 'document_file' && hasExecutableExtension(file.name)) return 'blocked';
    if (rule.ext && !file.name.toLowerCase().endsWith(rule.ext)) return 'extension';
    if (file.size < 1) return 'empty';
    if (file.size > rule.maxBytes) return 'tooLarge';
    return null;
}

export function formatBytes(bytes: number, locale: string): string {
    const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;
    let value = bytes;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i += 1;
    }
    return new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: units[i],
        unitDisplay: 'narrow',
        maximumFractionDigits: i === 0 ? 0 : 1,
    }).format(value);
}

export function percent(part: number, total: number): number {
    return total > 0 ? Math.min(100, Math.round((part / total) * 100)) : 0;
}

export function buildImportParams(f: ImportFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? IMPORTS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.status) params['filter[status]'] = f.status;
    if (f.mode) params['filter[mode]'] = f.mode;
    return params;
}

export function buildRowParams(f: RowFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? ROWS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.status) params['filter[status]'] = f.status;
    return params;
}

/** Drops empty optional fields so the server only sees what the user chose. */
export function cleanCreatePayload(p: CreateImportPayload): CreateImportPayload {
    const out: CreateImportPayload = {
        name: p.name,
        mode: p.mode,
        archive_upload_id: p.archive_upload_id,
    };
    if (p.manifest_upload_id) out.manifest_upload_id = p.manifest_upload_id;
    if (p.department_ids?.length) out.department_ids = p.department_ids;
    if (p.section_ids?.length) out.section_ids = p.section_ids;
    if (p.type_ids?.length) out.type_ids = p.type_ids;
    if (p.entity_ids?.length) out.entity_ids = p.entity_ids;
    if (p.category) out.category = p.category;
    if (p.importance) out.importance = p.importance;
    if (p.skip_invalid) out.skip_invalid = true;
    return out;
}

/** A plain <a href> can't send the Bearer header, so downloads go through a blob. */
export function saveBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: fileName });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
