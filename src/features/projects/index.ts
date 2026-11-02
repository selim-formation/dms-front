/**
 * Projects Feature Module
 *
 * Project management: list (search/sort/status+type filters/trashed/
 * pagination), create (required file), edit, soft delete, restore,
 * permanent delete and bulk actions. Separate from the legacy
 * `all-projects` widget endpoint.
 *
 * Structure mirrors features/departments and reuses its neutral components.
 */

export const PROJECTS_FEATURE = {
  name: "projects",
  description: "Projects management feature",
  routes: ["/$tenant/projects"],
  permissions: [
    "read_projects",
    "create_projects",
    "update_projects",
    "delete_projects",
    "restore_projects",
    "force_delete_projects",
  ],
} as const;
