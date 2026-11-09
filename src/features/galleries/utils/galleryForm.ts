/**
 * Pure form logic for the create / edit gallery wizard and the add-images dialog.
 */

import { titleFromFileName } from './galleryPayload';
import type { Gallery, GalleryPayload, GalleryType, ImageInput } from '../types/gallery.types';

export const NAME_MAX = 255;
export const DESCRIPTION_MAX = 5000;
export const MANAGER_MAX = 255;
export const TITLE_MAX = 255;

export type FormStep = 'details' | 'images';

export interface ImageDraft {
    key: string;
    uploadId: string | null;
    fileName: string | null;
    title: string;
    uploading: boolean;
}

let counter = 0;
export const newImageDraft = (): ImageDraft => ({
    key: `i${Date.now()}-${counter++}`,
    uploadId: null,
    fileName: null,
    title: '',
    uploading: false,
});

export interface GalleryFormValues {
    name: string;
    type: GalleryType | '';
    description: string;
    manager_name: string;
    time_period: string;
}

export const EMPTY_VALUES: GalleryFormValues = { name: '', type: '', description: '', manager_name: '', time_period: '' };

/** Edit replaces every field, so everything is prefilled. */
export function valuesFromGallery(g: Gallery): GalleryFormValues {
    return {
        name: g.name,
        type: g.type ?? '',
        description: g.description ?? '',
        manager_name: g.manager_name ?? '',
        time_period: g.time_period ?? '',
    };
}

/** Key → i18n code (under `galleries:form.errors`). Server messages replace these when present. */
export type FormErrors = Record<string, string>;

export function validateDetails(v: GalleryFormValues): FormErrors {
    const e: FormErrors = {};
    if (!v.name.trim()) e.name = 'nameRequired';
    else if (v.name.trim().length > NAME_MAX) e.name = 'nameTooLong';
    if (!v.type) e.type = 'typeRequired';
    if (v.description.length > DESCRIPTION_MAX) e.description = 'descriptionTooLong';
    if (v.manager_name.length > MANAGER_MAX) e.manager_name = 'managerTooLong';
    return e;
}

/** Errors keyed `${prefix}N.field` for each draft that is not ready. */
export function validateImages(drafts: ImageDraft[], prefix = 'images.'): FormErrors {
    const e: FormErrors = {};
    drafts.forEach((d, i) => {
        if (d.uploading) e[`${prefix}${i}.upload_id`] = 'uploadPending';
        else if (!d.uploadId) e[`${prefix}${i}.upload_id`] = 'fileRequired';
        if (!d.title.trim()) e[`${prefix}${i}.title`] = 'imageTitleRequired';
        else if (d.title.trim().length > TITLE_MAX) e[`${prefix}${i}.title`] = 'imageTitleTooLong';
    });
    return e;
}

export const toImageInputs = (drafts: ImageDraft[]): ImageInput[] =>
    drafts.map((d) => ({ upload_id: d.uploadId as string, title: d.title.trim() }));

export function buildGalleryPayload(v: GalleryFormValues, drafts?: ImageDraft[]): GalleryPayload {
    const payload: GalleryPayload = { name: v.name.trim(), type: v.type as GalleryType };
    if (v.description.trim()) payload.description = v.description.trim();
    if (v.manager_name.trim()) payload.manager_name = v.manager_name.trim();
    if (v.time_period) payload.time_period = v.time_period;
    if (drafts?.length) payload.images = toImageInputs(drafts);
    return payload;
}

export const STEP_FIELDS: Record<FormStep, string[]> = {
    details: ['name', 'type', 'description', 'manager_name', 'time_period'],
    images: ['images'],
};

export function stepOfErrors(errors: FormErrors, steps: FormStep[]): FormStep | null {
    for (const step of steps) {
        if (Object.keys(errors).some((k) => STEP_FIELDS[step].some((f) => k === f || k.startsWith(`${f}.`)))) return step;
    }
    return null;
}

/** Laravel 422 → { field: firstMessage }. `images.2.upload_id` keeps its full key so the matching row can show it. */
export function serverFieldErrors(error: unknown): FormErrors {
    const errors = (error as { errors?: Record<string, string[]> } | null)?.errors;
    const out: FormErrors = {};
    if (!errors) return out;
    for (const [key, messages] of Object.entries(errors)) {
        const field = key.startsWith('images.') ? key : key.split('.')[0];
        if (!out[field] && messages?.[0]) out[field] = messages[0];
    }
    return out;
}

/** The errors of draft `index`, with the `images.N.` prefix removed. */
export function errorsOfDraft(errors: FormErrors, index: number): Record<string, string> {
    const prefix = `images.${index}.`;
    return Object.fromEntries(Object.entries(errors).filter(([k, v]) => k.startsWith(prefix) && v).map(([k, v]) => [k.slice(prefix.length), v]));
}

export { titleFromFileName };
