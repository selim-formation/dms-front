/**
 * Base API types and interfaces
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  meta?: ResponseMeta;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

/**
 * Pagination links
 */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

/**
 * Response metadata
 */
export interface ResponseMeta {
  timestamp?: string;
  version?: string;
  [key: string]: unknown;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  errors?: ValidationErrors;
  code?: string;
  status?: number;
}

/**
 * Validation errors from Laravel
 */
export interface ValidationErrors {
  [field: string]: string[];
}

/**
 * Base query parameters
 */
export interface BaseQueryParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
}

/**
 * Filter parameters
 */
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

/**
 * Request options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
}
