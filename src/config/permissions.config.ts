/**
 * Permission constants and configuration
 * Defines all permissions used throughout the application
 */

/**
 * Document permissions
 */
export const DocumentPermissions = {
  VIEW: "documents.view",
  VIEW_ANY: "documents.view.any",
  VIEW_OWN: "documents.view.own",
  CREATE: "documents.create",
  EDIT: "documents.edit",
  EDIT_ANY: "documents.edit.any",
  EDIT_OWN: "documents.edit.own",
  DELETE: "documents.delete",
  DELETE_ANY: "documents.delete.any",
  DELETE_OWN: "documents.delete.own",
  DOWNLOAD: "documents.download",
  SHARE: "documents.share",
  VERSION: "documents.version",
} as const;

/**
 * Workspace permissions
 */
export const WorkspacePermissions = {
  VIEW: "workspaces.view",
  CREATE: "workspaces.create",
  EDIT: "workspaces.edit",
  DELETE: "workspaces.delete",
  MANAGE_MEMBERS: "workspaces.manage-members",
} as const;

/**
 * User management permissions
 */
export const UserPermissions = {
  VIEW: "users.view",
  CREATE: "users.create",
  EDIT: "users.edit",
  DELETE: "users.delete",
  MANAGE: "users.manage",
  ASSIGN_ROLES: "users.assign-roles",
  ASSIGN_PERMISSIONS: "users.assign-permissions",
} as const;

/**
 * Team permissions
 */
export const TeamPermissions = {
  VIEW: "teams.view",
  CREATE: "teams.create",
  EDIT: "teams.edit",
  DELETE: "teams.delete",
  MANAGE_MEMBERS: "teams.manage-members",
} as const;

/**
 * Settings permissions
 */
export const SettingsPermissions = {
  VIEW: "settings.view",
  EDIT: "settings.edit",
  MANAGE_TENANT: "settings.manage-tenant",
  MANAGE_SECURITY: "settings.manage-security",
  MANAGE_INTEGRATIONS: "settings.manage-integrations",
} as const;

/**
 * Audit log permissions
 */
export const AuditPermissions = {
  VIEW: "audit.view",
  EXPORT: "audit.export",
} as const;

/**
 * All permissions combined
 */
export const Permissions = {
  ...DocumentPermissions,
  ...WorkspacePermissions,
  ...UserPermissions,
  ...TeamPermissions,
  ...SettingsPermissions,
  ...AuditPermissions,
} as const;

/**
 * Permission type
 */
export type Permission = (typeof Permissions)[keyof typeof Permissions];

/**
 * Permission groups for easier management
 */
export const PermissionGroups = {
  documents: Object.values(DocumentPermissions),
  workspaces: Object.values(WorkspacePermissions),
  users: Object.values(UserPermissions),
  teams: Object.values(TeamPermissions),
  settings: Object.values(SettingsPermissions),
  audit: Object.values(AuditPermissions),
} as const;
