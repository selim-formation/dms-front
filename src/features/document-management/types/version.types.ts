/**
 * Versions and process files of a managed document
 * (/api/{tenant}/document-management/{id}/versions, /process-files).
 */

import type { PersonRef } from './management.types';

/** `pending`, `queued` and `processing` mean the server is still moving the file. */
export type VersionUploadStatus = 'pending' | 'queued' | 'processing' | 'completed' | 'failed';

export interface VersionAbilities {
    update: boolean;
    delete: boolean;
}

export interface DocumentVersion {
    id: number;
    version: number;
    special_document_number: number | null;
    version_description: string | null;
    expire_date: string | null;
    reminder_before: number | null;
    export_date: string | null;
    /** Null until the file is in storage. */
    extension: string | null;
    size: number | null;
    upload_status: VersionUploadStatus;
    responsible: PersonRef | null;
    uploaded_by: PersonRef | null;
    abilities: VersionAbilities;
    created_at: string;
    updated_at: string;
}

/** Optional metadata. On edit the server REPLACES it: what is not sent becomes empty. */
export interface VersionMetaPayload {
    special_document_number?: number;
    expire_date?: string;
    reminder_before?: number;
    export_date?: string;
    version_description?: string;
}

export interface AddVersionPayload extends VersionMetaPayload {
    /** Id of a finished `document_file` upload. */
    upload_id: string;
}

export interface UpdateVersionPayload extends VersionMetaPayload {
    /** Present only when the file is replaced. */
    upload_id?: string;
}

export interface VersionBulkResult {
    affected: number;
}

export interface PreviewLink {
    url: string;
    expires_at: string;
}

/** Creation / renewal procedure files. */
export type ProcessKind = 'create' | 'update';

export type ProcessFilesState = Record<ProcessKind, { exists: boolean; status?: 'stored' | 'processing' | 'none' }>;
