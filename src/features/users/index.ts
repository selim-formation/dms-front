/**
 * Users Feature Module
 *
 * The admin "Users" screen as an API client (/api/{tenant}/user-management):
 * tabbed list (all / active / inactive / trash) with search, role and department
 * filters, create / edit dialog, activate / deactivate, trash, restore,
 * permanent delete and all-or-nothing bulk actions.
 * The old /users endpoints stay for pickers only (core/reference-data).
 *
 * Safety rules enforced in the UI (the server stays authoritative):
 * - row buttons come from `abilities` (permission, rank, yourself, state),
 * - you cannot change your own roles / departments / sections, nor delete or
 *   deactivate yourself; changing your own password needs the current one,
 * - bulk selection skips yourself and rows the server would refuse.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types,
 * utils) and reuses the language-neutral components of features/departments.
 */

export const USERS_FEATURE = {
  name: "users",
  description: "User management feature (list, create, edit, status, trash, bulk)",
  routes: ["/$tenant/users"],
  permissions: [
    "read_users",
    "create_users",
    "update_users",
    "delete_users",
    "restore_users",
    "force_delete_users",
    "can_active_users",
  ],
} as const;
