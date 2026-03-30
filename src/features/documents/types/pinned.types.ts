/**
 * Pinned Documents Types
 * Matches backend API contract for pinned documents
 */

/**
 * Document information in pinned document
 */
export interface PinnedDocumentInfo {
    id: number;
    title: string;
    description: string | null;
}

/**
 * User information in pinned document
 */
export interface PinnedDocumentUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Pinned document from API
 */
export interface PinnedDocumentData {
    id: number;
    document: PinnedDocumentInfo;
    user: PinnedDocumentUser;
    order: number;
    created_at: string;
    updated_at: string;
}

/**
 * API Response for pinned documents
 */
export interface GetPinnedDocumentsApiResponse {
    data: {
        data: PinnedDocumentData[];
    };
    message: string;
}

/**
 * Unified pinned document display type
 */
export interface DisplayPinnedDocument {
    id: number;
    documentId: number;
    documentTitle: string;
    documentDescription: string | null;
    pinnedBy: PinnedDocumentUser;
    order: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * API Response for pinning a document
 */
export interface PinDocumentApiResponse {
    data: PinnedDocumentData | null;
    message: string;
}

/**
 * API Response for unpinning a document
 */
export interface UnpinDocumentApiResponse {
    data: null;
    message: string;
}
