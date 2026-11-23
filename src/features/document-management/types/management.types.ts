/**
 * Document management contracts — /api/{tenant}/document-management
 * (list, view, create / edit, review, delete / restore / force delete, bulk).
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
    /** Null until the file has been moved into storage (`upload_status` completed). */
    extension: string | null;
    size: string | null;
    expire_date: string | null;
    reminder_before: string | null;
    upload_status: string;
    created_at: string;
}

export interface TitleRef {
    id: number;
    title: string | null;
}

/** `processing`: a new file was handed over and is being moved into storage. */
export interface ProcessFileState {
    exists: boolean;
    status: 'stored' | 'processing' | 'none';
}

export interface ManagedDocumentDetail extends ManagedDocument {
    approvals: DocumentApproval[];
    latest_version: LatestVersion | null;
    /** Edit-form prefill: ids go back in the PUT body. */
    types: TitleRef[];
    entities: TitleRef[];
    sections: TitleRef[];
    cc: PersonRef[];
    process_files: { create: ProcessFileState; update: ProcessFileState };
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

/** Body for edit (and the base of create). All ids are plain JSON whole numbers. */
export interface DocumentPayload {
    title: string;
    description?: string;
    importance: Importance;
    category: DocumentCategory;
    origin_department_id?: number;
    types: number[];
    departments: number[];
    sections?: number[];
    entities: number[];
    responsible: number;
    cc?: number[];
    /** Finished `document_file` upload. On edit, omit to keep the current file. */
    create_process_upload_id?: string;
    update_process_upload_id?: string;
}

export interface VersionPayload {
    /** Id of a finished `document_file` upload; each upload can be used once. */
    upload_id: string;
    special_document_number?: number;
    expire_date?: string;
    reminder_before?: number;
    export_date?: string;
    version_description?: string;
}

export interface CreateDocumentPayload extends DocumentPayload {
    versions?: VersionPayload[];
}

/** True while the server is still moving a version or process file into storage. */
export const isStoring = (d: ManagedDocumentDetail | undefined | null): boolean =>
    !!d && (UPLOAD_IN_PROGRESS.has(d.latest_version?.upload_status ?? '') || d.process_files?.create.status === 'processing' || d.process_files?.update.status === 'processing');

/** upload_status values that mean "the server is still moving the file". */
export const UPLOAD_IN_PROGRESS: ReadonlySet<string> = new Set(['queued', 'processing']);
