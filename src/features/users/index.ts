/**
 * Users Feature Module
 *
 * This module handles user management including:
 * - User listing and search
 * - User profile management
 * - User role and permission assignment
 * - User invitation and onboarding
 *
 * Structure:
 * - api/: API service functions and query/mutation hooks
 * - components/: React components specific to users
 * - hooks/: Custom hooks for user operations
 * - routes/: Route components for user pages
 * - types/: TypeScript types for users
 * - utils/: Utility functions for user operations
 */

export const USERS_FEATURE = {
  name: "users",
  description: "User management feature",
  routes: [
    "/$tenant/users",
    "/$tenant/users/$userId",
    "/$tenant/users/$userId/edit",
    "/$tenant/users/invite",
  ],
  permissions: [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "users.manage-permissions",
  ],
} as const;
