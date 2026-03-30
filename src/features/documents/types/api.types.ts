/**
 * Document API Response Types
 * Strictly matches backend API contract
 */

export interface Entity {
    id: number;
    title: string;
    image: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

export interface Department {
    id: number;
    title: string;
    image: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

export interface DocumentType {
    id: number;
    title: string;
    image: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

export interface DocumentActivity {
    id?: string | number;
    action?: string;
    timestamp?: string;
    userId?: string | number;
    details?: string | Record<string, unknown>;
}

export interface ApiDocument {
    id: number;
    title: string;
    description: string | null;
    version: number | null;
    path: string | null;
    extension: string | null;
    size: number | null;
    last_viewed: string | null;
    expire_date: string | null;
    reminder_before: number | null;
    importance: 'critical' | 'high' | 'medium' | 'low' | 'archival';
    category: 'operational' | 'establishment';
    origin_department: string | null;
    manual: boolean | null;
    details: string | null;
    version_history: string | null;
    uploaded_by: string | null;
    responsible: string | null;
    cc: string | null;
    entities: Entity[];
    departments: Department[];
    types: DocumentType[];
    document_activities: DocumentActivity[];
    created_at: string;
    updated_at: string;
}

export interface RenewalDocuments {
    renewal: ApiDocument[];
    one_time: ApiDocument[];
}

export interface DocumentsByTypeResponse {
    type: string;
    one_time: ApiDocument[];
    renewal: ApiDocument[];
}

export interface DocumentsByTypeApiResponse {
    data: DocumentsByTypeResponse[];
    message: string;
}

export interface DocumentsByDepartmentItem {
    department: string;
    renewal: ApiDocument[];
    one_time: ApiDocument[];
}

export interface DocumentsByDepartmentApiResponse {
    data: DocumentsByDepartmentItem[];
    message: string;
}

/**
 * Unified document type for UI consumption
 */
export interface UIDocument {
    id: number;
    title: string;
    description: string | null;
    importance: 'critical' | 'high' | 'medium' | 'low' | 'archival';
    category: 'operational' | 'establishment';
    expireDate: string | null;
    entities: Entity[];
    departments: Department[];
    types: DocumentType[];
    createdAt: string;
    updatedAt: string;
    isOneTime: boolean;
}

/**
 * Grouped documents structure for display
 */
export interface GroupedDocuments {
    name: string;
    establishment: {
        oneTime: UIDocument[];
        renewal: UIDocument[];
    };
    operational: {
        oneTime: UIDocument[];
        renewal: UIDocument[];
    };
    allDocuments: UIDocument[];
}

/**
 * Department grouped documents
 */
export interface DepartmentGroupedDocuments {
    department: string;
    oneTime: UIDocument[];
    renewal: UIDocument[];
    allDocuments: UIDocument[];
}

/**
 * Query parameters for documents list API
 */
export interface DocumentListParams {
    page?: number;
    per_page?: number;
    sort_by?: 'created_at' | 'updated_at' | 'title' | 'importance' | 'expire_date';
    sort_dir?: 'asc' | 'desc';
    search?: string;
    category?: number;
    department?: number;
    importance?: 'critical' | 'high' | 'medium' | 'low' | 'archival';
    entity?: number;
}

/**
 * Pagination metadata from API response
 */
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

/**
 * Documents list data structure
 */
export interface DocumentListData {
    data: ApiDocument[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: PaginationMeta;
}

/**
 * Full API response
 */
export interface DocumentListResponse {
    data: DocumentListData;
    message: string;
}

/**
 * User information as returned by the API
 */
export interface UserInfo {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    socialite_provider: string | null;
    socialite_id: string | null;
    socialite_token: string | null;
    socialite_refresh_token: string | null;
    socialite_token_expires_at: string | null;
    social_only: number;
}

/**
 * Document version history entry
 */
export interface DocumentVersionEntry {
    id: number;
    version: number;
    version_description: string | null;
    expire_date: string | null;
    reminder_before: string | null;
    path: string | null;
    extension: string | null;
    size: string | null;
    last_viewed: string | null;
    responsible: string | null;
    cc: string[];
    uploaded_by: UserInfo;
    created_at: string;
    updated_at: string;
}

/**
 * Document activity entry as returned by the API
 */
export interface ApiDocumentActivity {
    id: number;
    document_id: number;
    document_version_id: number | null;
    user_id: number;
    action: string;
    source: string;
    ip: string;
    created_at: string;
    updated_at: string;
}

/**
 * Document view response - single document from the view endpoint
 */
export interface DocumentViewData {
    id: number;
    title: string;
    description: string | null;
    version: number;
    path: string;
    extension: string;
    size: string;
    last_viewed: string;
    expire_date: string | null;
    reminder_before: string | null;
    importance: 'critical' | 'high' | 'medium' | 'low' | 'archival';
    category: 'operational' | 'establishment';
    origin_department: string | null;
    manual: boolean | null;
    details: string | null;
    version_history: DocumentVersionEntry[];
    uploaded_by: UserInfo;
    responsible: string | null;
    cc: string[];
    entities: Entity[];
    departments: Department[];
    types: DocumentType[];
    document_activities: ApiDocumentActivity[];
    created_at: string;
    updated_at: string;
}

/**
 * Document view API response
 */
export interface DocumentViewResponse {
    data: DocumentViewData[];
    message: string;
}
