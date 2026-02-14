/**
 * Teams Feature Module
 *
 * This module handles team management including:
 * - Team listing and creation
 * - Team member management
 * - Team permissions
 * - Team collaboration
 *
 * Structure:
 * - api/: API service functions and query/mutation hooks
 * - components/: React components specific to teams
 * - hooks/: Custom hooks for team operations
 * - routes/: Route components for team pages
 * - types/: TypeScript types for teams
 * - utils/: Utility functions for team operations
 */

export const TEAMS_FEATURE = {
  name: "teams",
  description: "Team management feature",
  routes: [
    "/$tenant/teams",
    "/$tenant/teams/$teamId",
    "/$tenant/teams/$teamId/members",
    "/$tenant/teams/new",
  ],
  permissions: [
    "teams.view",
    "teams.create",
    "teams.edit",
    "teams.delete",
    "teams.manage-members",
  ],
} as const;
