/**
 * TanStack Query Key Factory for Document Comments
 * Tenant-scoped, matching documentKeys.ts conventions
 */

export const commentKeys = {
  all: (tenant: string) => ['comments', tenant] as const,

  lists: (tenant: string) => [...commentKeys.all(tenant), 'list'] as const,

  byDocument: (tenant: string, documentId: number, page: number, perPage: number) =>
    [...commentKeys.lists(tenant), 'document', documentId, { page, perPage }] as const,

  byVersion: (
    tenant: string,
    documentId: number,
    versionId: number,
    page: number,
    perPage: number,
  ) =>
    [
      ...commentKeys.lists(tenant),
      'document',
      documentId,
      'version',
      versionId,
      { page, perPage },
    ] as const,

  // Base key covering every list page for a document, for broad invalidation
  documentLists: (tenant: string, documentId: number) =>
    [...commentKeys.lists(tenant), 'document', documentId] as const,

  threads: (tenant: string) => [...commentKeys.all(tenant), 'thread'] as const,
  thread: (tenant: string, commentId: number) =>
    [...commentKeys.threads(tenant), commentId] as const,

  reactionsLists: (tenant: string) => [...commentKeys.all(tenant), 'reactions'] as const,
  reactions: (tenant: string, commentId: number, page: number, perPage: number) =>
    [...commentKeys.reactionsLists(tenant), commentId, { page, perPage }] as const,
};
