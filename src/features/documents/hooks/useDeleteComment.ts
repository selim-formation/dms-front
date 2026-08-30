/**
 * useDeleteComment Hook
 * Soft-deletes a comment (author only). Optimistically removes it from the
 * active list cache, rolls back on failure.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApiService } from '../api/CommentsApiService';
import { commentKeys } from '../api/commentKeys';
import { removeCommentFromTree } from '../utils/commentCacheUtils';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { DocumentComment, PaginationMeta } from '../types/comment.types';

const log = logger.createScoped('useDeleteComment');

interface UseDeleteCommentOptions {
  documentId: number;
  documentVersionId?: number;
  page?: number;
  perPage?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteComment(options: UseDeleteCommentOptions) {
  const { documentId, documentVersionId, page = 1, perPage = 20, onSuccess, onError } = options;
  const tenant = useTenantId();
  const queryClient = useQueryClient();

  const queryKey = documentVersionId
    ? commentKeys.byVersion(tenant ?? '', documentId, documentVersionId, page, perPage)
    : commentKeys.byDocument(tenant ?? '', documentId, page, perPage);

  const mutation = useMutation({
    mutationFn: async (commentId: number) => {
      if (!tenant) throw new Error('Tenant is required to delete a comment');
      await commentsApiService.deleteComment(tenant, commentId);
      return commentId;
    },
    onMutate: async (commentId) => {
      if (!tenant) return;
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<{ comments: DocumentComment[]; meta: PaginationMeta }>(
        queryKey,
      );

      queryClient.setQueryData(queryKey, (old: typeof previous) => {
        if (!old) return old;
        return {
          ...old,
          comments: removeCommentFromTree(old.comments, commentId),
          // Decrement the real total immediately so the panel header and
          // Engagement card count don't lag until a refetch happens.
          meta: old.meta ? { ...old.meta, totalCount: Math.max(0, old.meta.totalCount - 1) } : old.meta,
        };
      });

      return { previous };
    },
    onError: (error: Error, _commentId, context) => {
      log.error('Delete comment failed, rolling back', { error });
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      onError?.(error);
    },
    onSuccess: () => onSuccess?.(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.documentLists(tenant ?? '', documentId) });
    },
  });

  return {
    deleteComment: mutation.mutate,
    deleteCommentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
