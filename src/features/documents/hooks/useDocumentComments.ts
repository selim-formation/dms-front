/**
 * useDocumentComments Hook
 * Paginated top-level comments for a document (or one of its versions),
 * replies + reactions already nested by the API - no extra requests needed.
 */

import { useQuery } from '@tanstack/react-query';
import { commentsApiService } from '../api/CommentsApiService';
import { commentKeys } from '../api/commentKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { DocumentComment, PaginationMeta } from '../types/comment.types';

const QUERY_CONFIG = {
  staleTime: 30 * 1000, // matches the API's own ~30s cache TTL
  gcTime: 10 * 60 * 1000,
  retry: 1,
  retryDelay: 1000,
} as const;

interface UseDocumentCommentsOptions {
  documentVersionId?: number;
  page?: number;
  perPage?: number;
  enabled?: boolean;
}

interface UseDocumentCommentsResult {
  comments: DocumentComment[];
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

export function useDocumentComments(
  documentId: number,
  options: UseDocumentCommentsOptions = {},
): UseDocumentCommentsResult {
  const { documentVersionId, page = 1, perPage = 20, enabled: enabledProp = true } = options;
  const tenant = useTenantId();
  const enabled = enabledProp && !!tenant && !!documentId;

  const queryKey = documentVersionId
    ? commentKeys.byVersion(tenant ?? '', documentId, documentVersionId, page, perPage)
    : commentKeys.byDocument(tenant ?? '', documentId, page, perPage);

  const query = useQuery({
    queryKey: enabled ? queryKey : ['comments', 'pending'],
    queryFn: async ({ signal }) => {
      if (!tenant) throw new Error('Tenant is required to fetch comments');

      return documentVersionId
        ? commentsApiService.fetchByVersion(
            tenant,
            documentId,
            documentVersionId,
            { page, per_page: perPage },
            signal,
          )
        : commentsApiService.fetchByDocument(
            tenant,
            documentId,
            { page, per_page: perPage },
            signal,
          );
    },
    enabled,
    ...QUERY_CONFIG,
  });

  return {
    comments: query.data?.comments ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
