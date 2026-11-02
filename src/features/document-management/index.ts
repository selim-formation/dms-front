/**
 * Document Management Feature Module (phase 1)
 *
 * The admin "Documents" screen as an API client: tabbed list with counts,
 * filters and search, view, approve / reject, delete, restore, permanent delete
 * and bulk actions. Creating / editing documents and versions come later.
 * Distinct from features/documents, which is the read-only browsing API.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types,
 * utils) and reuses the language-neutral components of features/departments.
 */

export const DOCUMENT_MANAGEMENT_FEATURE = {
  name: "document-management",
  description: "Document management feature (list, review, trash, bulk)",
  routes: ["/$tenant/document-management"],
  permissions: ["read_documents", "delete_documents", "restore_documents", "force_delete_documents"],
} as const;
