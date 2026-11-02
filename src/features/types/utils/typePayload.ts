/**
 * Pure helpers translating UI state into the wire format.
 */

import type { TypeFilters, TypeLocale, TypePayload } from '../types/type.types';

export const TYPES_PER_PAGE = 12;
export const TYPE_TITLE_MAX = 255;

/** Always paginates (sends `page`) so the server never falls back to legacy mode. */
export function buildTypeParams(f: TypeFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? TYPES_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

export function buildTypeFormData(p: TypePayload, method?: 'PUT'): FormData {
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
export function buildTypeJson(p: TypePayload) {
    return {
        translations: Object.fromEntries(
            Object.entries(p.titles ?? {}).map(([lang, title]) => [lang, { title }]),
        ),
        remove_image: p.removeImage,
    };
}

export interface TypeFormErrors {
    titles: Partial<Record<TypeLocale, string>>;
    translations?: string;
    image?: string;
    unsupported?: string;
}

/** Maps Laravel `errors` keys (`translations.en.title`, …) onto form fields. */
export function mapTypeErrors(errors: Record<string, string[]> | undefined): TypeFormErrors {
    const out: TypeFormErrors = { titles: {} };
    if (!errors) return out;
    for (const [key, messages] of Object.entries(errors)) {
        const msg = messages?.[0]
        if (!msg) continue
        const m = key.match(/^translations\.(en|ar)\.title$/)
        if (m) out.titles[m[1] as TypeLocale] = msg
        else if (key === 'translations') out.translations = msg
        else if (key === 'image') out.image = msg
        else if (key.startsWith('translations.')) out.unsupported = msg
    }
    return out;
}
