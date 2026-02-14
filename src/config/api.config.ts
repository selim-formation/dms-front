/**
 * API endpoint configuration
 * Defines all API routes used in the application
 */

export const apiEndpoints = {
  /**
   * Authentication endpoints
   */
  auth: {
    csrf: "/sanctum/csrf-cookie",
    loginGlobal: "/api/login",
    login: "/{tenant}/login",
    logout: "/{tenant}/logout",
    register: "/{tenant}/register",
    forgotPassword: "/{tenant}/forgot-password",
    resetPassword: "/{tenant}/reset-password",
    user: "/{tenant}/api/user",
    permissions: "/{tenant}/api/user/permissions",
  },

  /**
   * Tenant endpoints
   */
  tenants: {
    validate: "/api/tenants/{tenant}/validate",
    current: "/{tenant}/api/tenant",
    settings: "/{tenant}/api/tenant/settings",
  },

  /**
   * Document endpoints
   */
  documents: {
    list: "/{tenant}/api/documents",
    create: "/{tenant}/api/documents",
    detail: "/{tenant}/api/documents/{id}",
    update: "/{tenant}/api/documents/{id}",
    delete: "/{tenant}/api/documents/{id}",
    download: "/{tenant}/api/documents/{id}/download",
    upload: "/{tenant}/api/documents/upload",
    versions: "/{tenant}/api/documents/{id}/versions",
  },

  /**
   * Workspace endpoints
   */
  workspaces: {
    list: "/{tenant}/api/workspaces",
    create: "/{tenant}/api/workspaces",
    detail: "/{tenant}/api/workspaces/{id}",
    update: "/{tenant}/api/workspaces/{id}",
    delete: "/{tenant}/api/workspaces/{id}",
    members: "/{tenant}/api/workspaces/{id}/members",
    documents: "/{tenant}/api/workspaces/{id}/documents",
  },

  /**
   * User endpoints
   */
  users: {
    list: "/{tenant}/api/users",
    create: "/{tenant}/api/users",
    detail: "/{tenant}/api/users/{id}",
    update: "/{tenant}/api/users/{id}",
    delete: "/{tenant}/api/users/{id}",
    permissions: "/{tenant}/api/users/{id}/permissions",
    roles: "/{tenant}/api/users/{id}/roles",
  },

  /**
   * Team endpoints
   */
  teams: {
    list: "/{tenant}/api/teams",
    create: "/{tenant}/api/teams",
    detail: "/{tenant}/api/teams/{id}",
    update: "/{tenant}/api/teams/{id}",
    delete: "/{tenant}/api/teams/{id}",
    members: "/{tenant}/api/teams/{id}/members",
  },

  /**
   * Audit log endpoints
   */
  audit: {
    list: "/{tenant}/api/audit-logs",
    detail: "/{tenant}/api/audit-logs/{id}",
    export: "/{tenant}/api/audit-logs/export",
  },

  /**
   * Settings endpoints
   */
  settings: {
    profile: "/{tenant}/api/settings/profile",
    security: "/{tenant}/api/settings/security",
    preferences: "/{tenant}/api/settings/preferences",
    notifications: "/{tenant}/api/settings/notifications",
  },

  /**
   * Dashboard endpoints
   */
  dashboard: {
    stats: "/{tenant}/api/dashboard/stats",
    recentActivity: "/{tenant}/api/dashboard/recent-activity",
    recentDocuments: "/{tenant}/api/dashboard/recent-documents",
  },
} as const;

/**
 * Helper function to build API URLs with tenant and params
 */
export function buildApiUrl(
  endpoint: string,
  params: Record<string, string | number> = {},
): string {
  let url = endpoint;

  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, String(value));
  });

  return url;
}
