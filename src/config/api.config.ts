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
    recent: "api/{tenant}/documents/recent",
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
   * Document insights — admin/head dashboard analytics, one endpoint per chart
   */
  insights: {
    documents: "api/{tenant}/insights/documents/{metric}",
  },

  /**
   * Reference-data lookup lists — document type, related entity,
   * department. Read-only, flat unpaginated arrays, cached server-side.
   */
  departments: {
    list: "api/{tenant}/departments",
    stats: "api/{tenant}/departments/stats",
    detail: "api/{tenant}/departments/{id}",
    create: "api/{tenant}/departments",
    update: "api/{tenant}/departments/{id}",
    delete: "api/{tenant}/departments/{id}",
    restore: "api/{tenant}/departments/{id}/restore",
    forceDelete: "api/{tenant}/departments/{id}/force",
    bulk: "api/{tenant}/departments/bulk",
  },
  sections: {
    list: "api/{tenant}/sections",
    stats: "api/{tenant}/sections/stats",
    detail: "api/{tenant}/sections/{id}",
    create: "api/{tenant}/sections",
    update: "api/{tenant}/sections/{id}",
    delete: "api/{tenant}/sections/{id}",
    bulk: "api/{tenant}/sections/bulk",
  },
  roles: {
    list: "api/{tenant}/roles",
    detail: "api/{tenant}/roles/{id}",
    create: "api/{tenant}/roles",
    update: "api/{tenant}/roles/{id}",
    delete: "api/{tenant}/roles/{id}",
    bulk: "api/{tenant}/roles/bulk",
  },
  permissions: {
    list: "api/{tenant}/permissions",
  },
  documentManagement: {
    list: "api/{tenant}/document-management",
    counts: "api/{tenant}/document-management/counts",
    create: "api/{tenant}/document-management",
    update: "api/{tenant}/document-management/{id}",
    detail: "api/{tenant}/document-management/{id}",
    approve: "api/{tenant}/document-management/{id}/approve",
    reject: "api/{tenant}/document-management/{id}/reject",
    delete: "api/{tenant}/document-management/{id}",
    restore: "api/{tenant}/document-management/{id}/restore",
    forceDelete: "api/{tenant}/document-management/{id}/force",
    bulk: "api/{tenant}/document-management/bulk",
  },
  tenantManagement: {
    list: "api/tenant-management",
    detail: "api/tenant-management/{id}",
    create: "api/tenant-management",
    update: "api/tenant-management/{id}",
    delete: "api/tenant-management/{id}",
    restore: "api/tenant-management/{id}/restore",
    forceDelete: "api/tenant-management/{id}/force",
    bulk: "api/tenant-management/bulk",
  },
  userManagement: {
    list: "api/{tenant}/user-management",
    detail: "api/{tenant}/user-management/{id}",
    create: "api/{tenant}/user-management",
    update: "api/{tenant}/user-management/{id}",
    activate: "api/{tenant}/user-management/{id}/activate",
    deactivate: "api/{tenant}/user-management/{id}/deactivate",
    delete: "api/{tenant}/user-management/{id}",
    restore: "api/{tenant}/user-management/{id}/restore",
    forceDelete: "api/{tenant}/user-management/{id}/force",
    bulk: "api/{tenant}/user-management/bulk",
  },
  taskManagement: {
    list: "api/{tenant}/task-management",
    counts: "api/{tenant}/task-management/counts",
    create: "api/{tenant}/task-management",
    update: "api/{tenant}/task-management/{id}",
    detail: "api/{tenant}/task-management/{id}",
    status: "api/{tenant}/task-management/{id}/status",
    delete: "api/{tenant}/task-management/{id}",
    restore: "api/{tenant}/task-management/{id}/restore",
    forceDelete: "api/{tenant}/task-management/{id}/force",
    bulk: "api/{tenant}/task-management/bulk",
  },
  galleries: {
    list: "api/{tenant}/galleries",
    detail: "api/{tenant}/galleries/{id}",
    restore: "api/{tenant}/galleries/{id}/restore",
    forceDelete: "api/{tenant}/galleries/{id}/force",
    bulk: "api/{tenant}/galleries/bulk",
  },
  galleryImages: {
    list: "api/{tenant}/gallery-images",
    detail: "api/{tenant}/gallery-images/{id}",
    restore: "api/{tenant}/gallery-images/{id}/restore",
    forceDelete: "api/{tenant}/gallery-images/{id}/force",
    bulk: "api/{tenant}/gallery-images/bulk",
  },
  storageConnections: {
    list: "api/{tenant}/storage-connections",
    detail: "api/{tenant}/storage-connections/{id}",
    create: "api/{tenant}/storage-connections",
    update: "api/{tenant}/storage-connections/{id}",
    credentials: "api/{tenant}/storage-connections/{id}/credentials",
    test: "api/{tenant}/storage-connections/{id}/test",
    default: "api/{tenant}/storage-connections/{id}/default",
    disable: "api/{tenant}/storage-connections/{id}/disable",
    delete: "api/{tenant}/storage-connections/{id}",
  },
  documentVersions: {
    list: "api/{tenant}/document-management/{id}/versions",
    create: "api/{tenant}/document-management/{id}/versions",
    update: "api/{tenant}/document-management/{id}/versions/{versionId}",
    delete: "api/{tenant}/document-management/{id}/versions/{versionId}",
    bulk: "api/{tenant}/document-management/{id}/versions/bulk",
    preview: "api/{tenant}/document-management/{id}/versions/{versionId}/preview",
  },
  processFiles: {
    state: "api/{tenant}/document-management/{id}/process-files",
    file: "api/{tenant}/document-management/{id}/process-files/{kind}",
    preview: "api/{tenant}/document-management/{id}/process-files/{kind}/preview",
  },
  documentUploads: {
    uploads: "api/{tenant}/document-uploads",
    upload: "api/{tenant}/document-uploads/{uploadId}",
    chunk: "api/{tenant}/document-uploads/{uploadId}/chunks/{index}",
    completeUpload: "api/{tenant}/document-uploads/{uploadId}/complete",
  },
  documentImports: {
    list: "api/{tenant}/document-imports",
    create: "api/{tenant}/document-imports",
    detail: "api/{tenant}/document-imports/{id}",
    rows: "api/{tenant}/document-imports/{id}/rows",
    problems: "api/{tenant}/document-imports/{id}/problems",
    commit: "api/{tenant}/document-imports/{id}/commit",
    retry: "api/{tenant}/document-imports/{id}/retry",
    rollback: "api/{tenant}/document-imports/{id}/rollback",
    manifestTemplate: "api/{tenant}/document-imports/manifest-template",
    uploads: "api/{tenant}/document-imports/uploads",
    upload: "api/{tenant}/document-imports/uploads/{uploadId}",
    chunk: "api/{tenant}/document-imports/uploads/{uploadId}/chunks/{index}",
    completeUpload: "api/{tenant}/document-imports/uploads/{uploadId}/complete",
  },
  types: {
    list: "api/{tenant}/types",
    detail: "api/{tenant}/types/{id}",
    create: "api/{tenant}/types",
    update: "api/{tenant}/types/{id}",
    delete: "api/{tenant}/types/{id}",
    restore: "api/{tenant}/types/{id}/restore",
    forceDelete: "api/{tenant}/types/{id}/force",
    bulk: "api/{tenant}/types/bulk",
  },
  entities: {
    list: "api/{tenant}/entities",
    stats: "api/{tenant}/entities/stats",
    detail: "api/{tenant}/entities/{id}",
    create: "api/{tenant}/entities",
    update: "api/{tenant}/entities/{id}",
    delete: "api/{tenant}/entities/{id}",
    restore: "api/{tenant}/entities/{id}/restore",
    forceDelete: "api/{tenant}/entities/{id}/force",
    bulk: "api/{tenant}/entities/bulk",
  },

  /**
   * Projects management endpoints (distinct from the legacy
   * `all-projects` widget endpoint, which needs "General" membership).
   */
  projects: {
    list: "api/{tenant}/projects",
    detail: "api/{tenant}/projects/{id}",
    create: "api/{tenant}/projects",
    update: "api/{tenant}/projects/{id}",
    delete: "api/{tenant}/projects/{id}",
    restore: "api/{tenant}/projects/{id}/restore",
    forceDelete: "api/{tenant}/projects/{id}/force",
    bulk: "api/{tenant}/projects/bulk",
  },

  /** Employees management (name + email; separate from user accounts). */
  employees: {
    list: "api/{tenant}/employees",
    detail: "api/{tenant}/employees/{id}",
    create: "api/{tenant}/employees",
    update: "api/{tenant}/employees/{id}",
    delete: "api/{tenant}/employees/{id}",
    restore: "api/{tenant}/employees/{id}/restore",
    forceDelete: "api/{tenant}/employees/{id}/force",
    bulk: "api/{tenant}/employees/bulk",
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
    bulk: "api/{tenant}/document-shares/bulk",
    update: "api/{tenant}/document-shares/{id}",
    delete: "api/{tenant}/document-shares/{id}",
    download: "api/{tenant}/document-shares/{id}/download",
    link: "api/{tenant}/document-shares/{id}/link",
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
