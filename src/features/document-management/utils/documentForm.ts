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

export const TITLE_MAX = 255;
export const DESCRIPTION_MAX = 255;
export const MAX_VERSIONS = 50;

export { REMINDER_MAX, REMINDER_MIN, VERSION_DESCRIPTION_MAX };

export type FormStep = 'details' | 'classification' | 'people' | 'versions';

export interface VersionDraft extends VersionMetaValues {
    key: string;
    uploadId: string | null;
    fileName: string | null;
    uploading: boolean;
}

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
    versions: [],
};

/**
 * Edit prefill. The detail endpoint does not return types, sections, entities or
 * cc, so those start empty and must be chosen again (edit replaces them as sent).
 */
export function valuesFromDocument(doc: ManagedDocumentDetail): DocumentFormValues {
    return {
        ...EMPTY_VALUES,
        title: doc.title,
        description: doc.description ?? '',
        importance: doc.importance,
        category: doc.category,
        origin_department_id: doc.origin_department?.id ?? null,
        departments: doc.departments.map((d) => d.id),
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
        const field = key.startsWith('versions.') ? key : key.split('.')[0];
        if (!out[field] && messages?.[0]) out[field] = messages[0];
    }
    return out;
}
