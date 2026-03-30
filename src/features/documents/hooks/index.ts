/**
 * Document Query Hooks
 * Centralized export point for all document-related query hooks
 */

export {
    useDocumentsByTypes,
    useDocumentsByDepartments,
    useDocumentsByType,
    useDocumentsByDepartment,
    useAllDocumentsByType,
    useAllDocumentsByDepartment,
} from './useDocumentQueries';

export {
    useDocumentsList,
    useDocumentsPage,
    useDocumentsSearch,
    useDocumentsFilter,
    useInvalidateDocuments,
} from './useDocumentsList';

export { useDocument, useDocumentView } from './useDocument';

export { usePinnedDocuments } from './usePinnedDocuments';

export { useCreatePinnedDocument } from './useCreatePinnedDocument';

export { useUnpinDocument } from './useUnpinDocument';

export { useDocumentSearch } from './useDocumentSearch';
