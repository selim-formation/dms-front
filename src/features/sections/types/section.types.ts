/**
 * Section contracts — /api/{tenant}/sections (sub-units of a department).
 */

import type {
    ApiEnvelope,
    DepartmentBulkResult,
    DepartmentPaginationMeta,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };
export type SectionBulkResult = DepartmentBulkResult;

export interface SectionDepartment {
    id: number;
    title: string;
}

export interface Section {
    id: number;
    name: string;
    description: string | null;
    /** Temporary signed URL (~2h). Never persist. */
    image: string | null;
    image_url: string | null;
    tenant_id: string;
    department_id: number | null;
    department: SectionDepartment | null;
    /** Only on show / create / update. */
    documents_count?: number;
    created_at: string;
    updated_at: string;
}

export type SectionSort =
    | 'name'
    | '-name'
    | 'department'
    | '-department'
    | 'created_at'
    | '-created_at';

export interface SectionFilters {
    search?: string;
    sort?: SectionSort;
    departmentIds?: number[];
    hasImage?: boolean;
    createdThisMonth?: boolean;
    page?: number;
    perPage?: number;
}

export interface SectionPayload {
    name?: string;
    department_id?: number;
    /** `null` clears the description (update only). */
    description?: string | null;
    image?: File | null;
    removeImage?: boolean;
}

export interface SectionStats {
    total: number;
    with_image: number;
}

export interface SectionsPaginatedData {
    data: Section[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: DepartmentPaginationMeta;
}
