/**
 * Document Type contracts — /api/{tenant}/types (titles in every language).
 */

import type {
    ApiEnvelope,
    DepartmentBulkAction,
    DepartmentBulkResult,
    DepartmentPaginationMeta,
    DepartmentTrashed,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };
export type TypeBulkAction = DepartmentBulkAction;
export type TypeBulkResult = DepartmentBulkResult;
export type TypeTrashed = DepartmentTrashed;

export type TypeLocale = 'en' | 'ar';
export const TYPE_LOCALES: readonly TypeLocale[] = ['en', 'ar'] as const;

export interface DocumentType {
    id: number;
    /** Title in the application language (always English today). */
    title: string | null;
    translations: Record<TypeLocale, { title: string | null }>;
    /** Temporary signed URL (~2h). Never persist. */
    image: string | null;
    image_url: string | null;
    tenant_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export type TypeSort = 'created_at' | '-created_at' | 'updated_at' | '-updated_at';

export interface TypeFilters {
    search?: string;
    sort?: TypeSort;
    trashed?: TypeTrashed;
    page?: number;
    perPage?: number;
}

export interface TypePayload {
    titles?: Partial<Record<TypeLocale, string>>;
    image?: File | null;
    removeImage?: boolean;
}

export interface TypesPaginatedData {
    data: DocumentType[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: DepartmentPaginationMeta;
}
