/**
 * TanStack Query Key Factory for Pinned Documents
 * 
 * Defines all query keys for pinned documents feature using best practices
 */

export const pinnedDocumentsKeys = {
    all: ['pinnedDocuments'] as const,
    lists: () => [...pinnedDocumentsKeys.all, 'list'] as const,
    list: () => [...pinnedDocumentsKeys.lists()] as const,
    lasts: () => [...pinnedDocumentsKeys.all, 'last'] as const,
    last: () => [...pinnedDocumentsKeys.lasts()] as const,
};
