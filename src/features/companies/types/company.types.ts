/**
 * Company (tenant) management contracts — /api/tenant-management.
 * No `{tenant}` in the URL: companies are not inside a company.
 */

import type { ApiEnvelope, DepartmentPaginationMeta } from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type CompanyTrashed = 'with' | 'only';
export type CompanyBulkAction = 'delete' | 'restore' | 'force_delete';
export type CompanyRowAction = CompanyBulkAction;

/** Which buttons to show right now. Never re-implement these rules. */
export interface CompanyAbilities {
    update: boolean;
    delete: boolean;
    restore: boolean;
    force_delete: boolean;
}

export interface Company {
    /** System id (e.g. `bisco-misr`): part of every URL, never changes. */
    id: string;
    name: string;
    slug: string;
    /** Temporary signed link (~2h) or null. Never persist; the storage path is never returned. */
    logo_url: string | null;
    domains: string[];
    users_count: number;
    documents_count: number;
    permissions_count: number;
    /** Single company only (show / create / edit / restore) — never in the list. */
    permission_ids?: number[];
    deleted_at: string | null;
    abilities: CompanyAbilities;
    created_at: string;
    updated_at: string;
}

/** A tab is a preset of the trashed filter. */
export type CompanyTab = 'all' | 'trash';

export type CompanySort = 'name' | '-name' | 'id' | '-id' | 'created_at' | '-created_at' | 'updated_at' | '-updated_at';

export interface CompanyFilters {
    search?: string;
    trashed?: CompanyTrashed;
    hasLogo?: boolean;
    createdThisMonth?: boolean;
    permissionId?: number;
    sort?: CompanySort;
    page?: number;
    perPage?: number;
}

export interface CompaniesPaginatedData {
    data: Company[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta: DepartmentPaginationMeta;
}

export interface CompanyBulkResult {
    affected: number;
}

export interface CompanyCreatePayload {
    name: string;
    slug?: string;
    id?: string;
    permissions: number[];
    logo_upload_id?: string;
}

export interface CompanyEditPayload {
    /** Required: replaces the company's features. */
    permissions: number[];
    logo_upload_id?: string;
    remove_logo?: boolean;
}

export type CompanyPayload = CompanyCreatePayload | CompanyEditPayload;
