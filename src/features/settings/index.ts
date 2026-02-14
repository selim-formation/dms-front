/**
 * Settings Feature Module
 *
 * This module handles user and tenant settings including:
 * - Profile settings
 * - Security settings
 * - Notification preferences
 * - Tenant configuration (admin)
 *
 * Structure:
 * - api/: API service functions and query/mutation hooks
 * - components/: React components specific to settings
 * - hooks/: Custom hooks for settings operations
 * - routes/: Route components for settings pages
 * - types/: TypeScript types for settings
 * - utils/: Utility functions for settings operations
 */

export const SETTINGS_FEATURE = {
  name: "settings",
  description: "Settings management feature",
  routes: [
    "/$tenant/settings",
    "/$tenant/settings/profile",
    "/$tenant/settings/security",
    "/$tenant/settings/preferences",
  ],
  permissions: ["settings.view", "settings.edit"],
} as const;
