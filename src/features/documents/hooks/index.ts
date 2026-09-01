/**
 * Document Query Hooks
 * Centralized export point for all document-related query hooks
 */

export { useDocument, useDocumentView } from './useDocument';

export { useDocumentsList } from './useDocumentsList';
export { useDocumentsByTypes } from './useDocumentsByTypes';
export { useDocumentsByDepartments } from './useDocumentsByDepartments';
export { useDocumentSearch } from './useDocumentSearch';
export { useDocumentReminders } from './useDocumentReminders';
export { useActiveDocumentReminders } from './useActiveDocumentReminders';

export { usePinnedDocuments } from './usePinnedDocuments';

export { useCreatePinnedDocument } from './useCreatePinnedDocument';

export { useUnpinDocument } from './useUnpinDocument';

export { usePinnedStatus, useTogglePin } from './usePinnedStatus';

export { useFavorites } from './useFavorites';

export { useLastFavorites } from './useLastFavorites';

export { useCreateFavorite } from './useCreateFavorite';

export { useUpdateFavorite } from './useUpdateFavorite';

export { useDeleteFavorite } from './useDeleteFavorite';

export { useFavoriteStatus, useToggleFavorite } from './useFavoriteStatus';
