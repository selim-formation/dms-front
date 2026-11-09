/**
 * Gallery contracts — /api/{tenant}/galleries and /api/{tenant}/gallery-images.
 */

import type { ApiEnvelope, DepartmentPaginationMeta } from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type GalleryType = 'employees' | 'customers' | 'suppliers' | 'others' | 'managers' | 'events' | 'projects';
export type TrashedFilter = 'with' | 'only';
export type GalleryBulkAction = 'delete' | 'restore' | 'force_delete';

/** Which buttons to show right now. Never re-implement these rules. */
export interface GalleryAbilities {
    update: boolean;
    delete: boolean;
    restore: boolean;
    force_delete: boolean;
    add_images: boolean;
}

export interface Gallery {
    id: number;
    name: string;
    type: GalleryType | null;
    description: string | null;
    manager_name: string | null;
    /** YYYY-MM-DD */
    time_period: string | null;
    images_count: number;
    /** Temporary (2 hour) link: never store it. */
    cover_url: string | null;
    deleted_at: string | null;
    abilities: GalleryAbilities;
    created_at: string;
    updated_at: string;
}

export interface GalleryImageAbilities {
    update: boolean;
    delete: boolean;
    restore: boolean;
    force_delete: boolean;
}

export interface GalleryImage {
    id: number;
    gallery_id: number;
    gallery: { id: number; name: string } | null;
    title: string;
    /** Temporary link to the private file, valid 2 hours. */
    url: string | null;
    deleted_at: string | null;
    abilities: GalleryImageAbilities;
    created_at: string;
    updated_at: string;
}

export type GallerySort =
    | 'name' | '-name'
    | 'type' | '-type'
    | 'time_period' | '-time_period'
    | 'images_count' | '-images_count'
    | 'created_at' | '-created_at';

export interface GalleryFilters {
    search?: string;
    type?: GalleryType;
    hasImages?: boolean;
    trashed?: TrashedFilter;
    sort?: GallerySort;
    page?: number;
    perPage?: number;
}

export type ImageSort = 'title' | '-title' | 'created_at' | '-created_at';

export interface ImageFilters {
    galleryId?: number;
    search?: string;
    trashed?: TrashedFilter;
    sort?: ImageSort;
    page?: number;
    perPage?: number;
}

export interface Paginated<T> {
    data: T[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta: DepartmentPaginationMeta;
}

export interface BulkResult {
    affected: number;
}

export interface ImageInput {
    /** Id of a finished `document_file` upload; each upload can be used once. */
    upload_id: string;
    title: string;
}

/** Create / edit body. Edit REPLACES every field; `images` is create only. */
export interface GalleryPayload {
    name: string;
    type: GalleryType;
    description?: string;
    manager_name?: string;
    time_period?: string;
    images?: ImageInput[];
}

export interface AddImagesPayload {
    gallery_id: number;
    images: ImageInput[];
}

export interface UpdateImagePayload {
    title: string;
    /** Present only when the picture is replaced. */
    upload_id?: string;
}
