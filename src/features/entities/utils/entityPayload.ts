/**
 * Pure helpers translating UI state into the wire format.
 */

import type { EntityFilters, EntityLocale, EntityPayload } from '../types/entity.types';

export const ENTITIES_PER_PAGE = 12;
export const ENTITY_TITLE_MAX = 255;

/** Always paginates (sends `page`) so the server never falls back to legacy mode. */
export function buildEntityParams(f: EntityFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? ENTITIES_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    if (f.hasImage) params['filter[has_image]'] = 1;
    if (f.createdThisMonth) params['filter[created_this_month]'] = 1;
    return params;
}

export function buildEntityFormData(p: EntityPayload, method?: 'PUT'): FormData {
    const fd = new FormData();
    Object.entries(p.titles ?? {}).forEach(([lang, title]) =>
        fd.append(`translations[${lang}][title]`, title ?? ''),
    );
    if (p.image) fd.append('image', p.image);
    if (p.removeImage) fd.append('remove_image', '1');
    if (method) fd.append('_method', method);
    return fd;
}

/** JSON body for requests without a file. */
export function buildEntityJson(p: EntityPayload) {
    return {
        translations: Object.fromEntries(
            Object.entries(p.titles ?? {}).map(([lang, title]) => [lang, { title }]),
        ),
        remove_image: p.removeImage,
    };
}

export interface EntityFormErrors {
    titles: Partial<Record<EntityLocale, string>>;
    translations?: string;
    image?: string;
    unsupported?: string;
}

/** Maps Laravel `errors` keys (`translations.en.title`, …) onto form fields. */
export function mapEntityErrors(errors: Record<string, string[]> | undefined): EntityFormErrors {
    const out: EntityFormErrors = { titles: {} };
    if (!errors) return out;
    for (const [key, messages] of Object.entries(errors)) {
        const msg = messages?.[0]
        if (!msg) continue
        const m = key.match(/^translations\.(en|ar)\.title$/)
        if (m) out.titles[m[1] as EntityLocale] = msg
        else if (key === 'translations') out.translations = msg
        else if (key === 'image') out.image = msg
        else if (key.startsWith('translations.')) out.unsupported = msg
    }
    return out;
}
