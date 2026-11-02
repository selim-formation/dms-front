/**
 * Employees Feature Module
 *
 * Employee management (name + email, separate from user accounts): list
 * (search/sort/trashed/pagination), create, edit, soft delete, restore,
 * permanent delete and bulk actions.
 *
 * Structure mirrors features/projects and reuses features/departments' neutral components.
 */

export const EMPLOYEES_FEATURE = {
  name: "employees",
  description: "Employees management feature",
  routes: ["/$tenant/employees"],
  permissions: [
    "read_employees",
    "create_employees",
    "update_employees",
    "delete_employees",
    "restore_employees",
    "force_delete_employees",
  ],
} as const;
