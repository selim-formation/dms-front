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

/**
 * A single document as returned by every /documents* endpoint.
 *
 * Two gotchas from the backend docs, both handled here rather than at
 * every call site:
 * 1. `creation_process`/`renewal_process` are renamed to `manual`/`details`
 *    whenever the document has an entity titled "machine" — both key
 *    pairs are optional; read whichever pair is present.
 * 2. Dates are `d/m/Y` (date-only, no time) — different from every other
 *    module's date format, don't reuse a shared parser.
 */
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
  /** Free string set by the tenant admin — not a fixed enum. */
  importance: string;
  /** Free string set by the tenant admin — not a fixed enum. */
  category: string;
  /** Full Department object when the relation is loaded, else absent/null. */
  origin_department?: Department | null;
  creation_process?: string | null;
  renewal_process?: string | null;
  manual?: string | null;
  details?: string | null;
  /** Excludes the latest version. */
  version_history: DocumentVersionEntry[];
  /** Raw Eloquent model dump — no stable resource contract, field set may change release to release. */
  uploaded_by: Record<string, unknown> | null;
  /** Raw Eloquent model dump — same caveat as uploaded_by. */
  responsible: Record<string, unknown> | null;
  cc: string[] | null;
  entities: Entity[];
  departments: Department[];
  types: DocumentType[];
  document_activities: DocumentActivity[];
  created_at: string;
  updated_at: string;
}

export interface DocumentsByGroup {
  one_time: ApiDocument[];
  renewal: ApiDocument[];
}

/** GET /documents/documents-by-types — `type` is a plain string here. */
export interface DocumentsByTypeItem extends DocumentsByGroup {
  type: string;
}

export interface DocumentsByTypeApiResponse {
  data: DocumentsByTypeItem[];
  message: string;
}

/** GET /documents/documents-by-departments */
export interface DocumentsByDepartmentItem extends DocumentsByGroup {
  department: string;
}

export interface DocumentsByDepartmentApiResponse {
  data: DocumentsByDepartmentItem[];
  message: string;
}

/**
 * POST /documents/categorized — `type` is array-wrapped here (unlike
 * documents-by-types' plain string), and the envelope double-nests under
 * `data.data` only when NO filter was sent. Always read via
 * `unwrapCategorizedResponse()` below rather than a fixed path.
 */
export interface CategorizedGroup {
  type: string[];
  documents: ApiDocument[];
}

export interface CategorizedApiResponse {
  data: CategorizedGroup[] | { data: CategorizedGroup[] };
  message: string;
}

export interface CategorizedFilters {
  category?: string;
  entity?: string;
  department?: string;
  has_expire_date?: "true" | "false";
}

export function unwrapCategorizedResponse(response: CategorizedApiResponse): CategorizedGroup[] {
  const { data } = response;
  return Array.isArray(data) ? data : (data.data ?? []);
}

/** POST /documents/search body — entity/department/type are TITLE strings, not ids. */
export interface DocumentSearchFilters {
  category?: string;
  type?: string;
  entity?: string;
  department?: string;
  title?: string;
  has_expire_date?: "true" | "false";
  importance?: string;
}

export interface DocumentSearchProject {
  id: number;
  [key: string]: unknown;
}

export interface DocumentSearchData {
  documents: ApiDocument[];
  projects: DocumentSearchProject[];
}

export interface DocumentSearchApiResponse {
  data: DocumentSearchData;
  message: string;
}

/** GET /documents/reminder and /documents/active-reminders — flat array, no pagination. */
export interface DocumentsFlatListApiResponse {
  data: ApiDocument[];
  message: string;
}

/**
 * Query parameters for GET /documents — the backend only accepts `page`,
 * nothing else (no server-side search/sort/filter on this endpoint;
 * use POST /documents/search for filtered queries).
 */
export interface DocumentListParams {
  page?: number;
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
  importance: "critical" | "high" | "medium" | "low" | "archival";
  category: "operational" | "establishment";
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
