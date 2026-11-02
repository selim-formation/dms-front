/**
 * Document Entity contracts — /api/{tenant}/entities (titles in every language).
 */

import type {
    ApiEnvelope,
    DepartmentBulkAction,
    DepartmentBulkResult,
    DepartmentPaginationMeta,
    DepartmentTrashed,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };
export type EntityBulkAction = DepartmentBulkAction;
export type EntityBulkResult = DepartmentBulkResult;
export type EntityTrashed = DepartmentTrashed;

export type EntityLocale = 'en' | 'ar';
export const ENTITY_LOCALES: readonly EntityLocale[] = ['en', 'ar'] as const;

export interface DocumentEntity {
    id: number;
    /** Title in the application language (always English today). */
    title: string | null;
    translations: Record<EntityLocale, { title: string | null }>;
    /** Temporary signed URL (~2h). Never persist. */
    image: string | null;
    image_url: string | null;
    tenant_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export type EntitySort = 'created_at' | '-created_at' | 'updated_at' | '-updated_at';

export interface EntityFilters {
    search?: string;
    sort?: EntitySort;
    trashed?: EntityTrashed;
    hasImage?: boolean;
    createdThisMonth?: boolean;
    page?: number;
    perPage?: number;
}

export interface EntityStats {
    total: number;
    with_image: number;
    trashed: number;
}

export interface EntityPayload {
    titles?: Partial<Record<EntityLocale, string>>;
    image?: File | null;
    removeImage?: boolean;
}

export interface EntitiesPaginatedData {
    data: DocumentEntity[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: DepartmentPaginationMeta;
}
