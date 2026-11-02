/**
 * Document Share Types
 * Matches backend API contract for /document-shares
 */

export type DocumentShareStatus = 'active' | 'pending' | 'expired' | 'revoked';

export interface DocumentShareDocumentInfo {
    id: number;
    title: string;
    description: string | null;
}

export interface DocumentShareUser {
    id: number;
    name: string;
    email: string;
}

/** Who a share reaches: one user, or every member of a department/section. */
export type DocumentShareTargetType = 'user' | 'department' | 'section';

export interface DocumentShareTarget {
    type: DocumentShareTargetType;
    id: number;
    name: string;
}

/** Department/section as embedded in a share (backend uses `title` for departments, `name` for sections). */
export interface DocumentShareGroup {
    id: number;
    name?: string;
    title?: string;
    department_id?: number;
}

export interface DocumentShareData {
    id: number;
    document: DocumentShareDocumentInfo;
    shared_by: DocumentShareUser;
    /** Always read the recipient from `target` — works for all three types. */
    target: DocumentShareTarget;
    /** User object only for `user` shares, else null. */
    shared_with: DocumentShareUser | null;
    department: DocumentShareGroup | null;
    section: DocumentShareGroup | null;
    can_view: boolean;
    can_download: boolean;
    starts_at: string | null;
    expires_at: string | null;
    revoked_at: string | null;
    status: DocumentShareStatus;
    created_at: string;
    updated_at: string;
}

export interface DocumentSharesLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface DocumentSharesMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface DocumentSharesListParams {
    per_page?: number;
    page?: number;
}

export interface DocumentSharesPaginatedData {
    data: DocumentShareData[];
    links: DocumentSharesLinks;
    meta: DocumentSharesMeta;
}

/** Which side of the share the list represents */
export type DocumentShareDirection = 'given' | 'received';

export interface ShareAccessPayload {
    can_view?: boolean;
    can_download?: boolean;
    starts_at?: string | null;
    expires_at?: string | null;
}

/** Single-target create: exactly one of shared_with / department_id / section_id. */
export type CreateDocumentSharePayload = ShareAccessPayload & {
    document_id: number;
} & (
        | { shared_with: number; department_id?: never; section_id?: never }
        | { department_id: number; shared_with?: never; section_id?: never }
        | { section_id: number; shared_with?: never; department_id?: never }
    );

/** Bulk create: at least one list, each max 50 distinct ids. */
export interface BulkCreateDocumentSharePayload extends ShareAccessPayload {
    document_id: number;
    user_ids?: number[];
    department_ids?: number[];
    section_ids?: number[];
}

export interface DocumentShareLinkData {
    url: string;
    expires_at: string;
    file_name: string;
}

/** A target picked in the share dialog, before it is sent to the API. */
export interface SelectedShareTarget {
    type: DocumentShareTargetType;
    id: number;
    name: string;
    /** Secondary line (email for users). */
    description?: string;
}

export const MAX_SHARE_TARGETS_PER_TYPE = 50;

export interface UpdateDocumentSharePayload {
    can_view?: boolean;
    can_download?: boolean;
    starts_at?: string | null;
    expires_at?: string | null;
}

export interface GetDocumentSharesApiResponse {
    data: DocumentSharesPaginatedData;
    message: string;
}

export interface GetDocumentShareApiResponse {
    data: DocumentShareData;
    message: string;
}

export interface CreateDocumentShareApiResponse {
    data: DocumentShareData;
    message: string;
}

export interface BulkCreateDocumentShareApiResponse {
    data: DocumentShareData[];
    message: string;
}

export interface GetDocumentShareLinkApiResponse {
    data: DocumentShareLinkData;
    message: string;
}

export interface UpdateDocumentShareApiResponse {
    data: DocumentShareData;
    message: string;
}

export interface RevokeDocumentShareApiResponse {
    data: null;
    message: string;
}

/** Minimal user record used by the recipient picker */
export interface ShareRecipientUser {
    id: number;
    name: string;
    email: string;
}
