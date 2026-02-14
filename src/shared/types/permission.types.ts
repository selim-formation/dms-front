/**
 * Permission-related types
 */

/**
 * Permission string type
 */
export type PermissionString = string;

/**
 * Role type
 */
export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: PermissionString[];
  created_at: string;
  updated_at: string;
}

/**
 * Permission check options
 */
export interface PermissionCheckOptions {
  requireAll?: boolean; // If true, user must have all permissions
}

/**
 * Ability subject types
 */
export type AbilitySubject =
  | "Document"
  | "Workspace"
  | "User"
  | "Team"
  | "Settings"
  | "Audit";

/**
 * Ability action types
 */
export type AbilityAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "manage"
  | "share";

/**
 * Ability definition
 */
export interface Ability {
  action: AbilityAction;
  subject: AbilitySubject;
  fields?: string[];
  conditions?: Record<string, unknown>;
}
