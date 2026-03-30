import type { DocumentFilters } from '../types';
import type { DocumentListParams } from '../types/api.types';

/**
 * Query key factory pattern for TanStack Query
 * Provides type-safe, hierarchical query keys for caching and invalidation
 */
export const documentKeys = {
  // Root keys
  all: (tenant: string) => ['documents', tenant] as const,

  // List operations - paginated documents
  lists: (tenant: string) => [...documentKeys.all(tenant), 'list'] as const,
  list: (tenant: string, filters: DocumentFilters) =>
    [...documentKeys.lists(tenant), filters] as const,

  // Paginated list with query params
  paginatedList: (tenant: string, params: DocumentListParams = {}) =>
    [...documentKeys.lists(tenant), 'paginated', params] as const,

  // Detail operations
  detail: (tenant: string, id: number) =>
    [...documentKeys.all(tenant), 'detail', id] as const,

  // View operations - full document view with all details
  view: (tenant: string, id: number) =>
    [...documentKeys.all(tenant), 'view', id] as const,

  // Statistical data
  stats: (tenant: string) => [...documentKeys.all(tenant), 'stats'] as const,

  // Grouped documents - by entity types
  byType: (tenant: string) => [...documentKeys.all(tenant), 'by-type'] as const,

  // Grouped documents - by departments
  byDept: (tenant: string) => [...documentKeys.all(tenant), 'by-dept'] as const,

  // Reminder operations
  reminders: (tenant: string) => [...documentKeys.all(tenant), 'reminders'] as const,

  // Search operations
  search: (tenant: string, params: Record<string, unknown> = {}) =>
    [...documentKeys.all(tenant), 'search', params] as const,
};
