/**
 * Pure helpers: constants, query params, image-file rules and bulk-action rules.
 */

import type {
    Gallery,
    GalleryBulkAction,
    GalleryFilters,
    GalleryType,
    ImageFilters,
} from '../types/gallery.types';

export const GALLERIES_PER_PAGE = 15;
export const IMAGES_PER_PAGE = 12;
export const MAX_NEW_IMAGES = 20;

export const GALLERY_TYPES: GalleryType[] = ['employees', 'customers', 'suppliers', 'others', 'managers', 'events', 'projects'];

export function buildGalleryParams(f: GalleryFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? GALLERIES_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.type) params['filter[type]'] = f.type;
    if (f.hasImages !== undefined) params['filter[has_images]'] = f.hasImages ? 1 : 0;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

export function buildImageParams(f: ImageFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? IMAGES_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.galleryId !== undefined) params['filter[gallery_id]'] = f.galleryId;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

/** Mirror of the server's rule (the server still decodes the content): jpg, jpeg, png, webp, gif, up to 10 MB. */
export const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif';
export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const;
export const IMAGE_MAX_BYTES = 10 * 1024 ** 2;

export type ImageProblem = 'extension' | 'empty' | 'tooLarge';

export function validateImage(file: File): ImageProblem | null {
    const ext = file.name.toLowerCase().split('.').pop() ?? '';
    if (!(IMAGE_EXTENSIONS as readonly string[]).includes(ext)) return 'extension';
    if (file.size < 1) return 'empty';
    if (file.size > IMAGE_MAX_BYTES) return 'tooLarge';
    return null;
}

/** `photo-final.JPG` → `photo-final` (default title of a freshly picked picture). */
export const titleFromFileName = (name: string): string => name.replace(/\.[^.]+$/, '').slice(0, 255);

/** Bulk actions offered in a view, already filtered by the user's permissions. */
export function bulkActionsFor(
    trashView: boolean,
    can: { delete: boolean; restore: boolean; forceDelete: boolean },
): GalleryBulkAction[] {
    if (trashView) {
        return [...(can.restore ? (['restore'] as const) : []), ...(can.forceDelete ? (['force_delete'] as const) : [])];
    }
    return can.delete ? ['delete'] : [];
}

/** All-or-nothing bulk: only rows the server will accept may be selected. */
export function isSelectable(item: { abilities: Pick<Gallery['abilities'], 'delete' | 'restore' | 'force_delete'> }, trashView: boolean): boolean {
    return trashView ? item.abilities.restore || item.abilities.force_delete : item.abilities.delete;
}
