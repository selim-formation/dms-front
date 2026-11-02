/**
 * Project contracts — /api/{tenant}/projects (management screens).
 */

import type {
    ApiEnvelope,
    DepartmentBulkAction,
    DepartmentBulkResult,
    DepartmentPaginationMeta,
    DepartmentTrashed,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };
export type ProjectBulkAction = DepartmentBulkAction;
export type ProjectBulkResult = DepartmentBulkResult;
export type ProjectTrashed = DepartmentTrashed;

export const PROJECT_STATUSES = ['active', 'completed', 'pending', 'in_progress', 'on_hold', 'cancelled'] as const;
export const PROJECT_TYPES = ['internal', 'external', 'research', 'development'] as const;
export const DURATION_TYPES = ['days', 'weeks', 'months', 'years'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type DurationType = (typeof DURATION_TYPES)[number];

export interface Project {
    id: number;
    name: string;
    description: string | null;
    status: ProjectStatus | null;
    type: ProjectType | null;
    category: string | null;
    start_date: string | null; // YYYY-MM-DD
    end_date: string | null;
    duration: number | null;
    duration_type: DurationType | null;
    manager_name: string | null;
    /** Temporary signed URL (~2h). Never persist. */
    project_file: string;
    tenant_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export type ProjectSort =
    | 'name' | '-name'
    | 'status' | '-status'
    | 'start_date' | '-start_date'
    | 'end_date' | '-end_date'
    | 'created_at' | '-created_at'
    | 'updated_at' | '-updated_at';

export interface ProjectFilters {
    search?: string;
    sort?: ProjectSort;
    status?: ProjectStatus[];
    type?: ProjectType[];
    trashed?: ProjectTrashed;
    page?: number;
    perPage?: number;
}

/** `null` clears an optional field; `undefined` leaves it out. */
export interface ProjectPayload {
    name?: string;
    description?: string | null;
    status?: ProjectStatus | null;
    type?: ProjectType | null;
    category?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    duration?: number | null;
    duration_type?: DurationType | null;
    manager_name?: string | null;
    project_file?: File;
}

export interface ProjectsPaginatedData {
    data: Project[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: DepartmentPaginationMeta;
}
