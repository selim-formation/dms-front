/**
 * Department Types
 * Matches the backend contract for /api/{tenant}/departments (full CRUD).
 */

export interface DepartmentSection {
    id: number;
    name: string;
}

export interface Department {
    id: number;
    title: string;
    /** Temporary signed URL (~2h). Never persist; refetch when an <img> fails. */
    image: string | null;
    image_url: string | null;
    tenant_id: string;
    sections_count: number;
    /** Present on show/create/update/restore, or on the list with include=sections. */
    sections?: DepartmentSection[];
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export type DepartmentSort =
    | 'title'
    | '-title'
    | 'created_at'
    | '-created_at'
    | 'updated_at'
    | '-updated_at';

export type DepartmentTrashed = 'with' | 'only';

export interface DepartmentFilters {
    search?: string;
    sort?: DepartmentSort;
    trashed?: DepartmentTrashed;
    hasImage?: boolean;
    createdThisMonth?: boolean;
    sectionIds?: number[];
    page?: number;
    perPage?: number;
}

export interface DepartmentPayload {
    title?: string;
    image?: File | null;
    removeImage?: boolean;
    sections?: number[];
}

export type DepartmentBulkAction = 'delete' | 'restore' | 'force_delete';

export interface DepartmentBulkResult {
    processed: number;
    ids: number[];
}

export interface DepartmentStats {
    total: number;
    with_image: number;
    trashed: number;
}

export interface DepartmentPaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface DepartmentsPaginatedData {
    data: Department[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: DepartmentPaginationMeta;
}

export interface ApiEnvelope<T> {
    data: T;
    message: string;
}
