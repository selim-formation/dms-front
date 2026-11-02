/**
 * Document Imports Feature Module
 *
 * Bulk import of documents from a ZIP archive — a workflow, not CRUD:
 * chunked resumable upload → create → (server checks) → review → start →
 * retry failed rows / roll back / download problems.
 *
 * Structure mirrors the other features (api, hooks, components, pages, types,
 * utils) and reuses the language-neutral components of features/departments.
 */

export const DOCUMENT_IMPORTS_FEATURE = {
  name: "document-imports",
  description: "Bulk document import feature",
  routes: ["/$tenant/document-imports", "/$tenant/document-imports/$importId"],
  permissions: ["read_documents", "create_documents", "delete_documents"],
} as const;
