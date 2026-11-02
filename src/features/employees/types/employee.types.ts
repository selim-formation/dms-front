/**
 * Employee contracts — /api/{tenant}/employees.
 * An employee is only a name + email (not a user account).
 */

import type {
    ApiEnvelope,
    DepartmentBulkAction,
    DepartmentBulkResult,
    DepartmentPaginationMeta,
    DepartmentTrashed,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };
export type EmployeeBulkAction = DepartmentBulkAction;
export type EmployeeBulkResult = DepartmentBulkResult;
export type EmployeeTrashed = DepartmentTrashed;

export interface Employee {
    id: number;
    name: string;
    email: string;
    tenant_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export type EmployeeSort =
    | 'name' | '-name'
    | 'email' | '-email'
    | 'created_at' | '-created_at'
    | 'updated_at' | '-updated_at';

export interface EmployeeFilters {
    search?: string;
    sort?: EmployeeSort;
    trashed?: EmployeeTrashed;
    page?: number;
    perPage?: number;
}

/** Both fields are required on create; neither can be emptied on update. */
export interface EmployeePayload {
    name?: string;
    email?: string;
}

export interface EmployeesPaginatedData {
    data: Employee[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: DepartmentPaginationMeta;
}
