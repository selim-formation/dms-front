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
    list: "api/{tenant}/documents",
    view: "api/{tenant}/documents/{id}/view",
    download: "api/{tenant}/documents/{documentId}/download",
    categorized: "api/{tenant}/documents/categorized",
    search: "api/{tenant}/documents/search",
    reminder: "api/{tenant}/documents/reminder",
    activeReminders: "api/{tenant}/documents/active-reminders",
    byTypes: "api/{tenant}/documents/documents-by-types",
    byDepartments: "api/{tenant}/documents/documents-by-departments",
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
    list: "/api/{tenant}/users",
    create: "/api/{tenant}/users",
    detail: "/api/{tenant}/users/{id}",
    update: "/api/{tenant}/users/{id}",
    delete: "/api/{tenant}/users/{id}",
    permissions: "/api/{tenant}/users/{id}/permissions",
    roles: "/api/{tenant}/users/{id}/roles",
  },

  /**
   * Team endpoints — roster of the current user's visible colleagues
   * (department-scoped via User::scopeVisibleTo on the backend)
   */
  teams: {
    list: "api/{tenant}/teams",
    stats: "api/{tenant}/teams/stats",
  },

  /**
   * Reference-data lookup lists — document type, related entity,
   * department. Read-only, flat unpaginated arrays, cached server-side.
   */
  departments: {
    list: "api/{tenant}/departments",
  },
  types: {
    list: "api/{tenant}/types",
  },
  entities: {
    list: "api/{tenant}/entities",
  },

  /**
   * Audit log endpoints
   */
  audit: {
    list: "/api/{tenant}/audit-logs",
    detail: "/api/{tenant}/audit-logs/{id}",
    export: "/api/{tenant}/audit-logs/export",
  },

  /**
   * Settings endpoints
   */
  settings: {
    profile: "/api/{tenant}/settings/profile",
    security: "/api/{tenant}/settings/security",
    preferences: "/api/{tenant}/settings/preferences",
    notifications: "/api/{tenant}/settings/notifications",
  },

  /**
   * Dashboard endpoints
   */
  dashboard: {
    stats: "/api/{tenant}/dashboard/stats",
    recentActivity: "/api/{tenant}/dashboard/recent-activity",
    recentDocuments: "/api/{tenant}/dashboard/recent-documents",
  },

  /**
   * Task endpoints
   */
  tasks: {
    list: "api/{tenant}/tasks",
    detail: "api/{tenant}/tasks/{id}",
    create: "api/{tenant}/tasks",
    update: "api/{tenant}/tasks/{id}",
    delete: "api/{tenant}/tasks/{id}",
    last: "api/{tenant}/tasks/last",
  },

  /**
   * Reminders endpoints
   */
  reminders: {
    all: "api/{tenant}/documents/reminder",
    active: "api/{tenant}/documents/active-reminders",
  },

  /**
   * Notifications endpoints
   */
  notifications: {
    list: "api/{tenant}/notifications",
  },

  /**
   * Pinned Documents endpoints
   */
  pinnedDocuments: {
    list: "api/{tenant}/pinned-documents",
    last: "api/{tenant}/pinned-documents/last",
    view: "api/{tenant}/pinned-documents/{id}/view",
    pin: "api/{tenant}/pinned-documents/pin",
    unpin: "api/{tenant}/pinned-documents/{id}/unpin",
    order: "api/{tenant}/pinned-documents/{id}/order",
  },

  /**
   * Profile endpoint (aggregate: user + stats + recent documents/favorites/pinned/tasks)
   */
  profile: {
    get: "api/{tenant}/profile",
  },

  /**
   * Favorites endpoints
   */
  favorites: {
    list: "api/{tenant}/favorites",
    last: "api/{tenant}/favorites/last",
    view: "api/{tenant}/favorites/{id}/view",
    create: "api/{tenant}/favorites",
    update: "api/{tenant}/favorites/{id}",
    delete: "api/{tenant}/favorites/{id}",
  },

  /**
   * Document shares endpoints
   */
  documentShares: {
    given: "api/{tenant}/document-shares/given",
    received: "api/{tenant}/document-shares/received",
    view: "api/{tenant}/document-shares/{id}",
    create: "api/{tenant}/document-shares",
    update: "api/{tenant}/document-shares/{id}",
    delete: "api/{tenant}/document-shares/{id}",
  },

  /**
   * Document comments & reactions endpoints
   */
  comments: {
    byDocument: "api/{tenant}/comments/document/{documentId}",
    byVersion:
      "api/{tenant}/comments/document/{documentId}/version/{versionId}",
    thread: "api/{tenant}/comments/{commentId}/thread",
    store: "api/{tenant}/comments/store",
    update: "api/{tenant}/comments/{commentId}/update",
    delete: "api/{tenant}/comments/{commentId}/delete",
    reactions: "api/{tenant}/comments/{commentId}/reactions",
    toggleReaction: "api/{tenant}/comments/{commentId}/reactions/toggle",
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
