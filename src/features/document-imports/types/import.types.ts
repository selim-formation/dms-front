/**
 * Document import contracts — /api/{tenant}/document-imports (a workflow, not CRUD).
 */

import type {
    ApiEnvelope,
    DepartmentPaginationMeta,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type ImportMode = 'create_only' | 'append_versions';
export type ImportStatus =
    | 'draft'
    | 'preparing'
    | 'validating'
    | 'ready'
    | 'committing'
    | 'rolling_back'
    | 'completed'
    | 'completed_errors'
    | 'failed'
    | 'rolled_back';
export type RowStatus = 'pending' | 'valid' | 'invalid' | 'committed' | 'failed' | 'skipped';
export type ImportCategory = 'establishment' | 'operational';
export type ImportImportance = 'low' | 'medium' | 'high' | 'critical' | 'informational' | 'archival';
export type ImportAction = 'commit' | 'retry' | 'rollback';

export interface ImportDefaults {
    department_ids: number[];
    section_ids: number[];
    type_ids: number[];
    entity_ids: number[];
    category: ImportCategory | null;
    importance: ImportImportance | null;
}

export interface DocumentImport {
    id: number;
    name: string;
    mode: ImportMode;
    status: ImportStatus;
    is_finished: boolean;
    /** The server is working: keep polling while true. */
    is_in_progress: boolean;
    progress_percent: number;
    total_rows: number;
    valid_rows: number;
    invalid_rows: number;
    committed_rows: number;
    failed_rows: number;
    documents_created: number;
    versions_created: number;
    skip_invalid: boolean;
    has_manifest: boolean;
    unlisted_files: number | null;
    defaults: ImportDefaults;
    error: string | null;
    creator: { id: number; name: string } | null;
    /** Buttons to show right now (state AND permission). Never re-implement these rules. */
    actions: { commit: boolean; retry: boolean; rollback: boolean; download_problems: boolean };
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ImportRow {
    id: number;
    row_number: number;
    file_name: string;
    title: string;
    external_ref: string | null;
    version_number: number | null;
    status: RowStatus;
    error: string | null;
}

export type UploadKind = 'archive' | 'manifest';
export type UploadStatus = 'uploading' | 'assembling' | 'complete' | 'failed' | 'consumed';

export interface ImportUpload {
    id: string;
    kind: UploadKind;
    file_name: string;
    size: number;
    chunk_size: number;
    total_chunks: number;
    status: UploadStatus;
    received_chunks: number[];
    error: string | null;
    expires_at: string;
}

export interface CreateImportPayload {
    name: string;
    mode: ImportMode;
    archive_upload_id: string;
    manifest_upload_id?: string;
    department_ids?: number[];
    section_ids?: number[];
    type_ids?: number[];
    entity_ids?: number[];
    category?: ImportCategory;
    importance?: ImportImportance;
    skip_invalid?: boolean;
}

export type ImportSort = 'name' | '-name' | 'status' | '-status' | 'created_at' | '-created_at';

export interface ImportFilters {
    search?: string;
    status?: ImportStatus;
    mode?: ImportMode;
    sort?: ImportSort;
    page?: number;
    perPage?: number;
}

export type RowSort = 'row_number' | '-row_number' | 'status' | '-status' | 'file_name' | '-file_name';

export interface RowFilters {
    search?: string;
    status?: RowStatus;
    sort?: RowSort;
    page?: number;
    perPage?: number;
}

export interface Paginated<T> {
    data: T[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta: DepartmentPaginationMeta;
}

/** Visual tone shared by status badges. */
export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';
