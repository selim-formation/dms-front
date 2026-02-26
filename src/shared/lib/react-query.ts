/**
 * React Query configuration and utilities
 */

import { QueryClient, type DefaultOptions } from "@tanstack/react-query";
import { appConfig } from "@/config/app.config";
import { logger } from "../utils/logger";

/**
 * Default query options
 */
const queryConfig: DefaultOptions = {
  queries: {
    staleTime: appConfig.query.defaultStaleTime,
    gcTime: appConfig.query.defaultCacheTime, // gcTime is the new API name for cacheTime
    refetchOnWindowFocus: appConfig.query.refetchOnWindowFocus,
    refetchOnReconnect: appConfig.query.refetchOnReconnect,
    retry: appConfig.query.retry,

    // Throw errors to error boundaries
    throwOnError: false,
  },
  mutations: {
    // Log mutation errors
    onError: (error) => {
      logger.error("Mutation error", { data: error });
    },
  },
};

/**
 * Create query client instance
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

/**
 * Query key factory for tenant-scoped keys
 * Ensures all queries are scoped by tenant to prevent cache leakage
 */
export const queryKeys = {
  /**
   * Authentication keys
   */
  auth: {
    all: ["auth"] as const,
    user: (tenantId: string) => ["auth", tenantId, "user"] as const,
    permissions: (tenantId: string) =>
      ["auth", tenantId, "permissions"] as const,
  },

  /**
   * Tenant keys
   */
  tenant: {
    all: ["tenant"] as const,
    detail: (tenantId: string) => ["tenant", tenantId] as const,
    validation: (tenantId: string) =>
      ["tenant", tenantId, "validation"] as const,
    settings: (tenantId: string) => ["tenant", tenantId, "settings"] as const,
  },

  /**
   * Document keys
   */
  documents: {
    all: (tenantId: string) => ["documents", tenantId] as const,
    lists: (tenantId: string) => ["documents", tenantId, "list"] as const,
    list: (tenantId: string, filters?: unknown) =>
      ["documents", tenantId, "list", filters] as const,
    details: (tenantId: string) => ["documents", tenantId, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      ["documents", tenantId, "detail", id] as const,
    versions: (tenantId: string, id: string) =>
      ["documents", tenantId, "versions", id] as const,
  },

  /**
   * Workspace keys
   */
  workspaces: {
    all: (tenantId: string) => ["workspaces", tenantId] as const,
    lists: (tenantId: string) => ["workspaces", tenantId, "list"] as const,
    list: (tenantId: string, filters?: unknown) =>
      ["workspaces", tenantId, "list", filters] as const,
    details: (tenantId: string) => ["workspaces", tenantId, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      ["workspaces", tenantId, "detail", id] as const,
    members: (tenantId: string, id: string) =>
      ["workspaces", tenantId, "members", id] as const,
  },

  /**
   * User keys
   */
  users: {
    all: (tenantId: string) => ["users", tenantId] as const,
    lists: (tenantId: string) => ["users", tenantId, "list"] as const,
    list: (tenantId: string, filters?: unknown) =>
      ["users", tenantId, "list", filters] as const,
    details: (tenantId: string) => ["users", tenantId, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      ["users", tenantId, "detail", id] as const,
  },

  /**
   * Team keys
   */
  teams: {
    all: (tenantId: string) => ["teams", tenantId] as const,
    lists: (tenantId: string) => ["teams", tenantId, "list"] as const,
    list: (tenantId: string, filters?: unknown) =>
      ["teams", tenantId, "list", filters] as const,
    details: (tenantId: string) => ["teams", tenantId, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      ["teams", tenantId, "detail", id] as const,
    members: (tenantId: string, id: string) =>
      ["teams", tenantId, "members", id] as const,
  },

  /**
   * Audit keys
   */
  audit: {
    all: (tenantId: string) => ["audit", tenantId] as const,
    lists: (tenantId: string) => ["audit", tenantId, "list"] as const,
    list: (tenantId: string, filters?: unknown) =>
      ["audit", tenantId, "list", filters] as const,
  },

  /**
   * Settings keys
   */
  settings: {
    all: (tenantId: string) => ["settings", tenantId] as const,
    profile: (tenantId: string) => ["settings", tenantId, "profile"] as const,
    security: (tenantId: string) => ["settings", tenantId, "security"] as const,
    preferences: (tenantId: string) =>
      ["settings", tenantId, "preferences"] as const,
  },

  /**
   * Dashboard keys
   */
  dashboard: {
    all: (tenantId: string) => ["dashboard", tenantId] as const,
    stats: (tenantId: string) => ["dashboard", tenantId, "stats"] as const,
    activity: (tenantId: string) =>
      ["dashboard", tenantId, "activity"] as const,
  },
};
