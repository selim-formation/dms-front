/**
 * Document Search Types
 * Strictly matches the POST /{tenant}/documents/search API contract
 */

// ─── Request ────────────────────────────────────────────────────────────────

export interface DocumentSearchParams {
    /** Filter by document category */
    category?: string;
    /** Filter by document type (exact match with type title) */
    type?: string;
    /** Filter by entity (exact match with entity title) */
    entity?: string;
    /** Filter by department (requires permission) */
    department?: string;
    /** Search by document title (LIKE search) */
    title?: string;
    /** Filter documents by expiration status */
    has_expire_date?: 'true' | 'false';
    /** Filter by importance level */
    importance?: 'High' | 'Medium' | 'Low';
}

// ─── Response ────────────────────────────────────────────────────────────────

export interface SearchDocumentDepartment {
    id: number;
    title: string;
}

export interface SearchDocumentUser {
    id: number;
    name: string;
    email: string;
}

export interface SearchDocumentVersionHistory {
    id: number;
    version: number;
    document_version: string;
    extension: string;
    size: number;
    created_at: string;
}

export interface SearchDocumentActivity {
    id: number;
    user_id: number;
    action: string;
    created_at: string;
}

export interface SearchDocumentEntity {
    id: number;
    title: string;
}

export interface SearchDocumentType {
    id: number;
    title: string;
}

export interface SearchDocument {
    id: number;
    title: string;
    description: string | null;
    version: number;
    path: string | null;
    extension: string | null;
    size: number | null;
    last_viewed: string | null;
    expire_date: string | null;
    reminder_before: number | null;
    importance: string;
    category: string;
    origin_department: SearchDocumentDepartment | null;
    manual: string | null;
    details: string | null;
    version_history: SearchDocumentVersionHistory[];
    uploaded_by: SearchDocumentUser | null;
    responsible: SearchDocumentUser | null;
    cc: string[];
    entities: SearchDocumentEntity[];
    departments: SearchDocumentDepartment[];
    types: SearchDocumentType[];
    document_activities: SearchDocumentActivity[];
    created_at: string;
}

export interface SearchProject {
    id: number;
    name: string;
    description: string | null;
}

export interface DocumentSearchData {
    documents: SearchDocument[];
    projects: SearchProject[];
}

export interface DocumentSearchApiResponse {
    status: boolean;
    message: string;
    data: DocumentSearchData;
}

// ─── Hook result ─────────────────────────────────────────────────────────────

export interface UseDocumentSearchResult {
    documents: SearchDocument[];
    projects: SearchProject[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isFetching: boolean;
    refetch: () => Promise<unknown>;
}
