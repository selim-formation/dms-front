/**
 * useUpdateComment Hook
 * Edits a comment's content (author only). Optimistic in-place update with
 * rollback on failure.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApiService } from '../api/CommentsApiService';
import { commentKeys } from '../api/commentKeys';
import { mapCommentTree } from '../utils/commentCacheUtils';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { DocumentComment, UpdateCommentPayload } from '../types/comment.types';

const log = logger.createScoped('useUpdateComment');

interface UseUpdateCommentOptions {
  documentId: number;
  documentVersionId?: number;
  page?: number;
  perPage?: number;
  onSuccess?: (comment: DocumentComment) => void;
  onError?: (error: Error) => void;
}

interface UpdateCommentVars {
  commentId: number;
  payload: UpdateCommentPayload;
}

export function useUpdateComment(options: UseUpdateCommentOptions) {
  const { documentId, documentVersionId, page = 1, perPage = 20, onSuccess, onError } = options;
  const tenant = useTenantId();
  const queryClient = useQueryClient();

  const queryKey = documentVersionId
    ? commentKeys.byVersion(tenant ?? '', documentId, documentVersionId, page, perPage)
    : commentKeys.byDocument(tenant ?? '', documentId, page, perPage);

  const mutation = useMutation({
    mutationFn: async ({ commentId, payload }: UpdateCommentVars) => {
      if (!tenant) throw new Error('Tenant is required to update a comment');
      return commentsApiService.updateComment(tenant, commentId, payload);
    },
    onMutate: async ({ commentId, payload }) => {
      if (!tenant) return;
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<{ comments: DocumentComment[]; meta: unknown }>(
        queryKey,
      );

      queryClient.setQueryData(queryKey, (old: typeof previous) => {
        if (!old) return old;
        return {
          ...old,
          comments: mapCommentTree(old.comments, commentId, (c) => ({
            ...c,
            content: payload.content ?? c.content,
            mentions: payload.mentions ?? c.mentions,
            attachments: payload.attachments ?? c.attachments,
            updated_at: new Date().toISOString(),
          })),
        };
      });

      return { previous };
    },
    onError: (error: Error, _vars, context) => {
      log.error('Update comment failed, rolling back', { error });
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      onError?.(error);
    },
    onSuccess: (comment, { commentId }) => {
      queryClient.setQueryData(queryKey, (old: { comments: DocumentComment[]; meta: unknown } | undefined) => {
        if (!old) return old;
        return { ...old, comments: mapCommentTree(old.comments, commentId, () => comment) };
      });
      onSuccess?.(comment);
    },
  });

  return {
    updateComment: mutation.mutate,
    updateCommentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
