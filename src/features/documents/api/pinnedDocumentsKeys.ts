/**
 * TanStack Query Key Factory for Pinned Documents
 *
 * Defines all query keys for the pinned documents feature. Scoped by
 * tenant (see favoritesKeys.ts for why) — same per-tenant/per-user
 * scoping as favorites, same reasoning for keying by tenant.
 */

export const pinnedDocumentsKeys = {
    all: (tenant: string) => ['pinnedDocuments', tenant] as const,
    lists: (tenant: string) => [...pinnedDocumentsKeys.all(tenant), 'list'] as const,
    list: (tenant: string) => [...pinnedDocumentsKeys.lists(tenant)] as const,
    lasts: (tenant: string) => [...pinnedDocumentsKeys.all(tenant), 'last'] as const,
    last: (tenant: string) => [...pinnedDocumentsKeys.lasts(tenant)] as const,
    details: (tenant: string) => [...pinnedDocumentsKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, pinnedDocumentId: number) =>
        [...pinnedDocumentsKeys.details(tenant), pinnedDocumentId] as const,
};
