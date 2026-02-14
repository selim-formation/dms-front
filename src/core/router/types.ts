/**
 * Router Types
 * Type definitions for router context and helpers
 */

import type { AuthContextValue } from "@/core/auth/types";
import type { TenantContextValue } from "@/core/tenant/types";
import type { QueryClient } from "@tanstack/react-query";

/**
 * Route Context
 * Available to all route loaders and guards
 */
export interface RouteContext {
  auth: AuthContextValue;
  tenant: TenantContextValue;
  queryClient: QueryClient;
  location: {
    pathname: string;
    search: Record<string, unknown>;
  };
}

/**
 * Route Params
 * Common route parameters
 */
export interface TenantRouteParams {
  tenant: string;
}

export interface DocumentRouteParams extends TenantRouteParams {
  documentId: string;
}

export interface WorkspaceRouteParams extends TenantRouteParams {
  workspaceId: string;
}

export interface UserRouteParams extends TenantRouteParams {
  userId: string;
}

export interface TeamRouteParams extends TenantRouteParams {
  teamId: string;
}

/**
 * Route Search Params
 * Common search/query parameters
 */
export interface PaginationSearch {
  page?: number;
  perPage?: number;
}

export interface SearchableSearch {
  q?: string;
}

export interface SortableSearch {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterableSearch {
  filters?: Record<string, unknown>;
}

export interface DocumentsSearch
  extends PaginationSearch, SearchableSearch, SortableSearch {
  status?: "active" | "archived" | "deleted";
  workspaceId?: string;
}

export interface UsersSearch
  extends PaginationSearch, SearchableSearch, SortableSearch {
  role?: string;
  status?: "active" | "inactive";
}

export interface AuditLogsSearch
  extends PaginationSearch, SearchableSearch, SortableSearch {
  entityType?: string;
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}
