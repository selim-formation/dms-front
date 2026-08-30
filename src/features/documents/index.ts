/**
 * Documents Feature Module
 *
 * This module handles all document-related functionality including:
 * - Document listing and search
 * - Document upload and download
 * - Document versioning
 * - Document sharing and permissions
 * - Document preview
 *
 * Structure:
 * - api/: API service functions and query/mutation hooks
 * - components/: React components specific to documents
 * - hooks/: Custom hooks for document operations
 * - routes/: Route components for document pages
 * - types/: TypeScript types for documents
 * - utils/: Utility functions for document operations
 */

export const DOCUMENTS_FEATURE = {
  name: "documents",
  description: "Document management feature",
  routes: [
    "/$tenant/documents",
    "/$tenant/documents/$documentId",
    "/$tenant/documents/$documentId/edit",
    "/$tenant/documents/new",
    "/$tenant/document-shares",
  ],
  permissions: [
    "documents.view",
    "documents.create",
    "documents.edit.own",
    "documents.edit.any",
    "documents.delete.own",
    "documents.delete.any",
    "documents.share",
    "read_document_shares",
    "create_document_shares",
    "update_document_shares",
    "delete_document_shares",
  ],
} as const;
