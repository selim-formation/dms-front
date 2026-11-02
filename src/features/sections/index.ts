/**
 * Sections Feature Module
 *
 * Sub-units of a department: list (search/sort/filters/pagination), stats,
 * view, create, edit, delete and bulk delete. Sections have no trash,
 * restore or permanent delete, and follow the *department* permissions.
 *
 * Structure mirrors features/departments (api, hooks, components, pages,
 * types, utils) and reuses its language-neutral components.
 */

export const SECTIONS_FEATURE = {
  name: "sections",
  description: "Department sections management feature",
  routes: ["/$tenant/sections"],
  permissions: [
    "read_departments",
    "create_departments",
    "update_departments",
    "delete_departments",
  ],
} as const;
