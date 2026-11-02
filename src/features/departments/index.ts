/**
 * Departments Feature Module
 *
 * Full CRUD for tenant departments: list (search/sort/filters/pagination),
 * view, create, edit, soft delete, restore, permanent delete, bulk actions
 * and statistics.
 *
 * Structure:
 * - api/: HTTP service + query-key factory
 * - components/: small memoised UI pieces (cards, filters, dialogs, states)
 * - hooks/: queries, mutations, filter/selection state, permissions
 * - pages/: DepartmentsPage composition
 * - types/ utils/: contracts and pure helpers
 */

export const DEPARTMENTS_FEATURE = {
  name: "departments",
  description: "Department management feature",
  routes: ["/$tenant/departments"],
  permissions: [
    "read_departments",
    "create_departments",
    "update_departments",
    "delete_departments",
    "restore_departments",
    "force_delete_departments",
  ],
} as const;
