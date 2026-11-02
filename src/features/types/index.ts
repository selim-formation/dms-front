/**
 * Types Feature Module
 *
 * Full CRUD for document types with per-language titles (EN/AR) and an
 * optional image: list (search/sort/trashed/pagination), view, create, edit,
 * soft delete, restore, permanent delete and bulk actions.
 *
 * Structure mirrors features/departments (api, hooks, components, pages,
 * types, utils) and reuses its language-neutral components.
 */

export const TYPES_FEATURE = {
  name: "types",
  description: "Document types management feature",
  routes: ["/$tenant/types"],
  permissions: [
    "read_types",
    "create_types",
    "update_types",
    "delete_types",
    "restore_types",
  ],
} as const;
