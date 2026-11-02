/**
 * Roles Feature Module
 *
 * A role is a name plus a set of permissions: list (search/sort/pagination),
 * view, create, edit, delete and bulk delete. No trash, restore or stats.
 *
 * Safety rules enforced in the UI (the server stays authoritative):
 * - you can only grant permissions you hold,
 * - system roles (admin, manager, head, key_user) can't be created/renamed/deleted,
 * - a role still held by users can't be deleted.
 *
 * Structure mirrors features/sections (api, hooks, components, pages, types,
 * utils) and reuses the language-neutral components of features/departments.
 */

export const ROLES_FEATURE = {
  name: "roles",
  description: "Roles and permissions management feature",
  routes: ["/$tenant/roles"],
  permissions: ["read_role", "create_role", "update_role", "delete_role"],
} as const;
