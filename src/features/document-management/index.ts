/**
 * Document Management Feature Module (phases 1-3)
 *
 * The admin "Documents" screen as an API client: tabbed list with counts,
 * filters and search, view, approve / reject, delete, restore, permanent delete
 * and bulk actions, create / edit with chunked file uploads, versions (add, edit,
 * replace file, delete, preview) and the creation / renewal process files.
 * Distinct from features/documents, which is the read-only browsing API.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types,
 * utils) and reuses the language-neutral components of features/departments.
 */

export const DOCUMENT_MANAGEMENT_FEATURE = {
  name: "document-management",
  description: "Document management feature (list, review, trash, bulk)",
  routes: [
    "/$tenant/document-management",
    "/$tenant/document-management/new",
    "/$tenant/document-management/$documentId/edit",
    "/$tenant/document-management/$documentId/versions",
  ],
  permissions: ["read_documents", "delete_documents", "restore_documents", "force_delete_documents", "create_documents", "update_documents", "read_versions", "create_versions", "update_versions", "delete_versions"],
} as const;
