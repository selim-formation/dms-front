/**
 * Entities Feature Module
 *
 * Full CRUD for document entities with per-language titles (EN/AR) and an
 * optional image: list (search/sort/trashed/pagination), view, create, edit,
 * soft delete, restore, permanent delete and bulk actions.
 *
 * Structure mirrors features/departments (api, hooks, components, pages,
 * entities, utils) and reuses its language-neutral components.
 */

export const ENTITIES_FEATURE = {
  name: "entities",
  description: "Document entities management feature",
  routes: ["/$tenant/entities"],
  permissions: [
    "read_entities",
    "create_entities",
    "update_entities",
    "delete_entities",
    "restore_entities",
    "force_delete_entities",
  ],
} as const;
