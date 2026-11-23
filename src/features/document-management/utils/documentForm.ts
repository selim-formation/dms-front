/**
 * Pure form logic: state shape, per-step validation, payload building and
 * server-error mapping for the create / edit document form.
 */

import {
    EMPTY_META,
    REMINDER_MAX,
    REMINDER_MIN,
    VERSION_DESCRIPTION_MAX,
    buildVersionMeta,
    validateVersionMeta,
    type VersionMetaValues,
} from './versionFields';
import type {
    CreateDocumentPayload,
    DocumentCategory,
    DocumentPayload,
    Importance,
    ManagedDocumentDetail,
    VersionPayload,
} from '../types/management.types';
import type { ProcessKind } from '../types/version.types';

export const TITLE_MAX = 255;
export const DESCRIPTION_MAX = 255;
export const MAX_VERSIONS = 50;

export { REMINDER_MAX, REMINDER_MIN, VERSION_DESCRIPTION_MAX };

export type FormStep = 'details' | 'classification' | 'people' | 'process' | 'versions';

export interface VersionDraft extends VersionMetaValues {
    key: string;
    uploadId: string | null;
    fileName: string | null;
    uploading: boolean;
}

/** A procedure file picked on the form; sent with the document as `*_process_upload_id`. */
export interface ProcessDraft {
    uploadId: string | null;
    fileName: string | null;
    uploading: boolean;
}

export const EMPTY_PROCESS: ProcessDraft = { uploadId: null, fileName: null, uploading: false };

export interface DocumentFormValues {
    title: string;
    description: string;
    importance: Importance | '';
    category: DocumentCategory | '';
    origin_department_id: number | null;
    types: number[];
    departments: number[];
    sections: number[];
    entities: number[];
    responsible: number | null;
    cc: number[];
    process: Record<ProcessKind, ProcessDraft>;
    versions: VersionDraft[];
}

let counter = 0;
export const newVersionDraft = (): VersionDraft => ({
    key: `v${Date.now()}-${counter++}`,
    uploadId: null,
    fileName: null,
    uploading: false,
    ...EMPTY_META,
});

export const EMPTY_VALUES: DocumentFormValues = {
    title: '',
    description: '',
    importance: '',
    category: '',
    origin_department_id: null,
    types: [],
    departments: [],
    sections: [],
    entities: [],
    responsible: null,
    cc: [],
    process: { create: EMPTY_PROCESS, update: EMPTY_PROCESS },
    versions: [],
};

/** Edit prefill: the detail answer carries every relation the form needs. */
export function valuesFromDocument(doc: ManagedDocumentDetail): DocumentFormValues {
    return {
        ...EMPTY_VALUES,
        title: doc.title,
        description: doc.description ?? '',
        importance: doc.importance,
        category: doc.category,
        origin_department_id: doc.origin_department?.id ?? null,
        departments: doc.departments.map((d) => d.id),
        types: (doc.types ?? []).map((x) => x.id),
        entities: (doc.entities ?? []).map((x) => x.id),
        sections: (doc.sections ?? []).map((x) => x.id),
        cc: (doc.cc ?? []).map((x) => x.id),
        responsible: doc.responsible?.id ?? null,
    };
}

/** Error key → i18n key (under `management:form.errors`). Server messages replace these when present. */
export type FormErrors = Record<string, string>;

export function validateStep(step: FormStep, v: DocumentFormValues): FormErrors {
    const e: FormErrors = {};
    if (step === 'details') {
        if (!v.title.trim()) e.title = 'titleRequired';
        else if (v.title.trim().length > TITLE_MAX) e.title = 'titleTooLong';
        if (v.description.length > DESCRIPTION_MAX) e.description = 'descriptionTooLong';
        if (!v.importance) e.importance = 'importanceRequired';
        if (!v.category) e.category = 'categoryRequired';
    }
    if (step === 'classification') {
        if (v.types.length === 0) e.types = 'typesRequired';
        if (v.departments.length === 0) e.departments = 'departmentsRequired';
        if (v.entities.length === 0) e.entities = 'entitiesRequired';
    }
    if (step === 'people') {
        if (v.responsible === null) e.responsible = 'responsibleRequired';
    }
    if (step === 'process') {
        (['create', 'update'] as const).forEach((kind) => {
            if (v.process[kind].uploading) e[`process.${kind}`] = 'uploadPending';
        });
    }
    if (step === 'versions') {
        v.versions.forEach((ver, i) => {
            const p = `versions.${i}.`;
            if (ver.uploading) e[`${p}upload_id`] = 'uploadPending';
            else if (!ver.uploadId) e[`${p}upload_id`] = 'fileRequired';
            for (const [field, code] of Object.entries(validateVersionMeta(ver))) e[`${p}${field}`] = code;
        });
    }
    return e;
}

export const STEP_FIELDS: Record<FormStep, string[]> = {
    details: ['title', 'description', 'importance', 'category'],
    classification: ['origin_department_id', 'types', 'departments', 'sections', 'entities'],
    people: ['responsible', 'cc'],
    process: ['process'],
    versions: ['versions'],
};

/** First step that owns one of the errored fields (to jump to it after a 422). */
export function stepOfErrors(errors: FormErrors, steps: FormStep[]): FormStep | null {
    for (const step of steps) {
        if (Object.keys(errors).some((k) => STEP_FIELDS[step].some((f) => k === f || k.startsWith(`${f}.`)))) return step;
    }
    return null;
}

export function buildDocumentPayload(v: DocumentFormValues): DocumentPayload {
    const payload: DocumentPayload = {
        title: v.title.trim(),
        importance: v.importance as Importance,
        category: v.category as DocumentCategory,
        types: v.types,
        departments: v.departments,
        entities: v.entities,
        responsible: v.responsible as number,
        // An empty list clears them on edit, so these are always sent.
        sections: v.sections,
        cc: v.cc,
    };
    if (v.description.trim()) payload.description = v.description.trim();
    if (v.origin_department_id !== null) payload.origin_department_id = v.origin_department_id;
    // Same request as the document; on edit a missing field keeps the current file.
    if (v.process.create.uploadId) payload.create_process_upload_id = v.process.create.uploadId;
    if (v.process.update.uploadId) payload.update_process_upload_id = v.process.update.uploadId;
    return payload;
}

export function buildCreatePayload(v: DocumentFormValues): CreateDocumentPayload {
    const versions: VersionPayload[] = v.versions.map((ver) => ({ upload_id: ver.uploadId as string, ...buildVersionMeta(ver) }));
    return { ...buildDocumentPayload(v), ...(versions.length ? { versions } : {}) };
}

/**
 * Laravel 422 → { field: firstMessage }. `types.0` collapses to `types`;
 * `versions.2.expire_date` keeps its full key so the matching row can show it.
 */
export function serverFieldErrors(error: unknown): FormErrors {
    const errors = (error as { errors?: Record<string, string[]> } | null)?.errors;
    const out: FormErrors = {};
    if (!errors) return out;
    for (const [key, messages] of Object.entries(errors)) {
        const field = key.startsWith('versions.')
            ? key
            : key === 'create_process_upload_id' ? 'process.create'
            : key === 'update_process_upload_id' ? 'process.update'
            : key.split('.')[0];
        if (!out[field] && messages?.[0]) out[field] = messages[0];
    }
    return out;
}
