/**
 * Workspaces Feature Module
 *
 * This module handles workspace management including:
 * - Workspace listing and creation
 * - Workspace members management
 * - Workspace settings
 * - Workspace document organization
 *
 * Structure:
 * - api/: API service functions and query/mutation hooks
 * - components/: React components specific to workspaces
 * - hooks/: Custom hooks for workspace operations
 * - routes/: Route components for workspace pages
 * - types/: TypeScript types for workspaces
 * - utils/: Utility functions for workspace operations
 */

export const WORKSPACES_FEATURE = {
  name: "workspaces",
  description: "Workspace management feature",
  routes: [
    "/$tenant/workspaces",
    "/$tenant/workspaces/$workspaceId",
    "/$tenant/workspaces/$workspaceId/settings",
    "/$tenant/workspaces/new",
  ],
  permissions: [
    "workspaces.view",
    "workspaces.create",
    "workspaces.edit",
    "workspaces.delete",
    "workspaces.manage-members",
  ],
} as const;
