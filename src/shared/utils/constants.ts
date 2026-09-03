/**
 * Application-wide constants
 */

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: "dms_theme",
  LOCALE: "dms_locale",
  SIDEBAR_COLLAPSED: "dms_sidebar_collapsed",
  TABLE_PAGE_SIZE: "dms_table_page_size",
  RECENT_TENANTS: "dms_recent_tenants",
} as const;

/**
 * Query key prefixes for TanStack Query
 */
export const QUERY_KEYS = {
  AUTH: "auth",
  USER: "user",
  TENANT: "tenant",
  DOCUMENTS: "documents",
  WORKSPACES: "workspaces",
  USERS: "users",
  TEAMS: "teams",
  AUDIT: "audit",
  SETTINGS: "settings",
  DASHBOARD: "dashboard",
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/$tenant/login",
  REGISTER: "/$tenant/register",
  FORGOT_PASSWORD: "/$tenant/forgot-password",
  RESET_PASSWORD: "/$tenant/reset-password",
  DOCUMENTS: "/$tenant/documents",
  WORKSPACES: "/$tenant/workspaces",
  USERS: "/$tenant/users",
  TEAMS: "/$tenant/teams",
  AUDIT: "/$tenant/audit",
  SETTINGS: "/$tenant/settings",
} as const;

/**
 * Date format strings
 */
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_TIME: "MMM dd, yyyy HH:mm",
  INPUT: "yyyy-MM-dd",
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

/**
 * Debounce delays (in milliseconds)
 */
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Breakpoints (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  TENANT_NOT_FOUND: "Tenant not found or is no longer active.",
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully.",
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",
  DELETED: "Deleted successfully.",
  UPLOADED: "Uploaded successfully.",
} as const;
