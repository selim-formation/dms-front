/**
 * Document management contracts — /api/{tenant}/document-management
 * (phase 1: list, view, review, delete / restore / force delete, bulk).
 * Separate from features/documents, which is the read-only browsing API.
 */

import type {
    ApiEnvelope,
    DepartmentPaginationMeta,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type DocumentStatus = 'pending' | 'approved' | 'rejected';
export type Importance = 'critical' | 'high' | 'medium' | 'low' | 'informational' | 'archival';
export type DocumentCategory = 'establishment' | 'operational';
export type ReviewDecision = 'approve' | 'reject';
export type BulkAction = 'delete' | 'restore' | 'force_delete';
export type TrashedFilter = 'with' | 'only';

export interface PersonRef {
    id: number;
    name: string;
}

export interface DepartmentRef {
    id: number;
    title: string;
}

/** Which buttons to show right now for this user. Never re-implement these rules. */
export interface DocumentAbilities {
    update: boolean;
    delete: boolean;
    restore: boolean;
    force_delete: boolean;
    approve: boolean;
    reject: boolean;
}

export interface ManagedDocument {
    id: number;
    title: string;
    description: string | null;
    status: DocumentStatus;
    importance: Importance;
    category: DocumentCategory;
    creator: PersonRef | null;
    responsible: PersonRef | null;
    origin_department: DepartmentRef | null;
    departments: DepartmentRef[];
    versions_count: number;
    deleted_at: string | null;
    abilities: DocumentAbilities;
    created_at: string;
    updated_at: string;
}

export interface DocumentApproval {
    id: number;
    user: PersonRef | null;
    status: DocumentStatus;
    note: string | null;
    updated_at: string;
}

export interface LatestVersion {
    version: number;
    extension: string;
    size: string;
    expire_date: string | null;
    reminder_before: number | null;
    upload_status: string;
    created_at: string;
}

export interface ManagedDocumentDetail extends ManagedDocument {
    approvals: DocumentApproval[];
    latest_version: LatestVersion | null;
}

export interface DocumentCounts {
    all: number;
    approved: number;
    pending: number;
    rejected: number;
    trashed: number;
}

export type ManagementTab = 'all' | 'approved' | 'rejected' | 'pending' | 'trash';

export type ManagementSort =
    | 'title' | '-title'
    | 'status' | '-status'
    | 'importance' | '-importance'
    | 'category' | '-category'
    | 'created_at' | '-created_at';

export interface ManagementFilters {
    search?: string;
    status?: DocumentStatus;
    importance?: Importance;
    category?: DocumentCategory;
    trashed?: TrashedFilter;
    sort?: ManagementSort;
    page?: number;
    perPage?: number;
}

export interface ManagementPaginatedData {
    data: ManagedDocument[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta: DepartmentPaginationMeta;
}

export interface BulkResult {
    affected: number;
}

/** Same tones as the shared status badge. */
export type StatusToneAlias = 'success' | 'info' | 'warning' | 'danger' | 'neutral';
