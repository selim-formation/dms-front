/**
 * Pure helpers for the optional metadata of one version (shared by the create
 * form's version rows and the add / edit version dialog).
 */

import type { FormErrors } from './documentForm';
import type { DocumentVersion, VersionMetaPayload, VersionUploadStatus } from '../types/version.types';

export const VERSION_DESCRIPTION_MAX = 5000;
export const REMINDER_MIN = 1;
export const REMINDER_MAX = 3650;

/** Everything a text input holds, so the values stay strings until the payload is built. */
export interface VersionMetaValues {
    special_document_number: string;
    expire_date: string;
    reminder_before: string;
    export_date: string;
    version_description: string;
}

export const EMPTY_META: VersionMetaValues = {
    special_document_number: '',
    expire_date: '',
    reminder_before: '',
    export_date: '',
    version_description: '',
};

export type VersionMetaField = keyof VersionMetaValues;

const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Errors keyed by field name (no row prefix). Values are i18n codes under `form.errors`. */
export function validateVersionMeta(v: VersionMetaValues): FormErrors {
    const e: FormErrors = {};
    if (!!v.expire_date !== !!v.reminder_before) e[v.expire_date ? 'reminder_before' : 'expire_date'] = 'expiryPair';
    if (v.expire_date && !isDate(v.expire_date)) e.expire_date = 'dateInvalid';
    if (v.export_date && !isDate(v.export_date)) e.export_date = 'dateInvalid';
    if (v.reminder_before) {
        const n = Number(v.reminder_before);
        if (!Number.isInteger(n) || n < REMINDER_MIN || n > REMINDER_MAX) e.reminder_before = 'reminderRange';
    }
    if (v.special_document_number) {
        const n = Number(v.special_document_number);
        if (!Number.isInteger(n) || n < 0) e.special_document_number = 'numberInvalid';
    }
    if (v.version_description.length > VERSION_DESCRIPTION_MAX) e.version_description = 'versionDescriptionTooLong';
    return e;
}

export function buildVersionMeta(v: VersionMetaValues): VersionMetaPayload {
    const out: VersionMetaPayload = {};
    if (v.special_document_number) out.special_document_number = Number(v.special_document_number);
    if (v.expire_date) out.expire_date = v.expire_date;
    if (v.reminder_before) out.reminder_before = Number(v.reminder_before);
    if (v.export_date) out.export_date = v.export_date;
    if (v.version_description.trim()) out.version_description = v.version_description.trim();
    return out;
}

export function metaFromVersion(ver: DocumentVersion): VersionMetaValues {
    return {
        special_document_number: ver.special_document_number === null ? '' : String(ver.special_document_number),
        expire_date: ver.expire_date?.slice(0, 10) ?? '',
        reminder_before: ver.reminder_before === null ? '' : String(ver.reminder_before),
        export_date: ver.export_date?.slice(0, 10) ?? '',
        version_description: ver.version_description ?? '',
    };
}

/** Server is still storing the file: poll, and don't allow replacing it. */
export const VERSION_BUSY: ReadonlySet<string> = new Set<VersionUploadStatus>(['pending', 'queued', 'processing']);

export const isVersionBusy = (status: string): boolean => VERSION_BUSY.has(status);

/** Process files accept a narrower set than version files, at most 100 MB. */
export const PROCESS_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff'] as const;
export const PROCESS_FILE_ACCEPT = PROCESS_FILE_EXTENSIONS.map((e) => `.${e}`).join(',');
export const PROCESS_FILE_MAX_BYTES = 100 * 1024 ** 2;

export type ProcessFileProblem = 'extension' | 'empty' | 'tooLarge';

export function validateProcessFile(file: File): ProcessFileProblem | null {
    const ext = file.name.toLowerCase().split('.').pop() ?? '';
    if (!(PROCESS_FILE_EXTENSIONS as readonly string[]).includes(ext)) return 'extension';
    if (file.size < 1) return 'empty';
    if (file.size > PROCESS_FILE_MAX_BYTES) return 'tooLarge';
    return null;
}
