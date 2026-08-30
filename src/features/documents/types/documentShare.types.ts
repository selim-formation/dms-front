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

export interface DocumentShareData {
    id: number;
    document: DocumentShareDocumentInfo;
    shared_by: DocumentShareUser;
    shared_with: DocumentShareUser;
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

export interface CreateDocumentSharePayload {
    document_id: number;
    shared_with: number;
    can_view?: boolean;
    can_download?: boolean;
    starts_at?: string | null;
    expires_at?: string | null;
}

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
