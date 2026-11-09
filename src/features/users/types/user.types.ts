/**
 * User management contracts — /api/{tenant}/user-management.
 * (The old /users endpoints stay for pickers only.)
 */

import type { ApiEnvelope, DepartmentPaginationMeta } from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type UserStatus = 'active' | 'inactive';
export type UserTrashed = 'with' | 'only';
export type UserBulkAction = 'delete' | 'restore' | 'force_delete';
export type UserRowAction = 'delete' | 'restore' | 'force_delete' | 'activate' | 'deactivate';
export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

/** Which buttons to show right now. Never re-implement these rules. */
export interface UserAbilities {
    update: boolean;
    delete: boolean;
    restore: boolean;
    force_delete: boolean;
    activate: boolean;
    deactivate: boolean;
}

export interface UserRoleRef {
    id: number;
    name: string;
}

export interface UserDepartmentRef {
    id: number;
    title: string;
}

export interface UserSectionRef {
    id: number;
    name: string;
    department_id: number;
}

export interface ManagedUser {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    /** Status in THIS company. */
    status: UserStatus | null;
    roles: UserRoleRef[];
    departments: UserDepartmentRef[];
    sections: UserSectionRef[];
    email_verified_at: string | null;
    deleted_at: string | null;
    abilities: UserAbilities;
    created_at: string;
    updated_at: string;
}

/** A tab is a preset of the status / trashed filters. */
export type UserTab = 'all' | 'active' | 'inactive' | 'trash';

export type UserSort =
    | 'name' | '-name'
    | 'email' | '-email'
    | 'created_at' | '-created_at'
    | 'updated_at' | '-updated_at'
    | 'email_verified_at' | '-email_verified_at';

export interface UserFilters {
    search?: string;
    status?: UserStatus;
    roleId?: number;
    departmentId?: number;
    trashed?: UserTrashed;
    sort?: UserSort;
    page?: number;
    perPage?: number;
}

export interface UsersPaginatedData {
    data: ManagedUser[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta: DepartmentPaginationMeta;
}

export interface UserBulkResult {
    affected: number;
}

/**
 * Create / edit body. On edit a list that is left out stays unchanged and a list
 * that is sent REPLACES the person's list in this company.
 */
export interface UserPayload {
    name?: string;
    email?: string;
    password?: string;
    /** Only when changing your OWN password. */
    current_password?: string;
    /** Required on create. */
    roles?: number[];
    departments?: number[];
    sections?: number[];
}

/** A selectable id + label (roles, departments, sections). */
export interface UserOption {
    id: number;
    label: string;
    /** Sections only. */
    departmentId?: number | null;
}
