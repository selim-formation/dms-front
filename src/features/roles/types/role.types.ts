/**
 * Role contracts — /api/{tenant}/roles (a name + a set of permissions).
 */

import type {
    ApiEnvelope,
    DepartmentBulkResult,
    DepartmentPaginationMeta,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };
export type RoleBulkResult = DepartmentBulkResult;

export interface RolePermission {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: 'web';
    tenant_id: string;
    permissions_count: number;
    /** Every holder, whatever their tenant (soft-deleted users included). */
    users_count: number;
    /** Only on show / create / update — never in the list. */
    permissions?: RolePermission[];
    created_at: string;
    updated_at: string;
}

export type RoleSort = 'name' | '-name' | 'created_at' | '-created_at';

export interface RoleFilters {
    search?: string;
    sort?: RoleSort;
    page?: number;
    perPage?: number;
}

export interface RolePayload {
    name?: string;
    /** The COMPLETE set the role should have afterwards (at least one id). */
    permissions?: number[];
}

export interface RolesPaginatedData {
    data: Role[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: DepartmentPaginationMeta;
}

/** Why a role cannot be deleted (UI disables the action with a tooltip). */
export type RoleDeleteBlock = 'system' | 'inUse';

export interface PermissionGroup {
    action: string;
    items: RolePermission[];
}
