/**
 * useCreateComment Hook
 * Posts a new top-level comment or a reply (parent_id set).
 * Optimistically inserts a pending comment into the active list cache so the
 * UI feels instant; reconciles with the server response, rolls back on error.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApiService } from '../api/CommentsApiService';
import { commentKeys } from '../api/commentKeys';
import { appendReply, prependComment } from '../utils/commentCacheUtils';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { useUser } from '@/core/auth/hooks/useAuth';
import { logger } from '@/shared/utils/logger';
import type { CreateCommentPayload, DocumentComment, PaginationMeta } from '../types/comment.types';

const log = logger.createScoped('useCreateComment');

interface UseCreateCommentOptions {
  documentId: number;
  documentVersionId?: number;
  page?: number;
  perPage?: number;
  onSuccess?: (comment: DocumentComment) => void;
  onError?: (error: Error) => void;
}

function buildOptimisticComment(
  payload: CreateCommentPayload,
  authorId: number,
  authorName: string,
): DocumentComment {
  return {
    id: -Date.now(), // negative temp id, replaced on success
    content: payload.content,
    document_id: payload.document_id,
    document_version_id: payload.document_version_id ?? null,
    user_id: authorId,
    parent_id: payload.parent_id ?? null,
    mentions: payload.mentions ?? null,
    attachments: payload.attachments ?? null,
    author: { id: authorId, name: authorName },
    parent: null,
    replies: [],
    reactions: [],
    reactions_count: 0,
    replies_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };
}

export function useCreateComment(options: UseCreateCommentOptions) {
  const { documentId, documentVersionId, page = 1, perPage = 20, onSuccess, onError } = options;
  const tenant = useTenantId();
  const user = useUser();
  const queryClient = useQueryClient();

  const queryKey = documentVersionId
    ? commentKeys.byVersion(tenant ?? '', documentId, documentVersionId, page, perPage)
    : commentKeys.byDocument(tenant ?? '', documentId, page, perPage);

  const mutation = useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      if (!tenant) throw new Error('Tenant is required to post a comment');
      return commentsApiService.createComment(tenant, payload);
    },
    onMutate: async (payload) => {
      if (!tenant) return;
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<{ comments: DocumentComment[]; meta: PaginationMeta }>(
        queryKey,
      );

      const optimistic = buildOptimisticComment(
        payload,
        user ? Number(user.id) : 0,
        user?.name ?? 'You',
      );

      queryClient.setQueryData(queryKey, (old: typeof previous) => {
        if (!old) return old;
        return {
          ...old,
          comments: payload.parent_id
            ? appendReply(old.comments, payload.parent_id, optimistic)
            : prependComment(old.comments, optimistic),
          // Bump the real total immediately so the panel header and Engagement
          // card count don't lag until the request settles and refetches.
          meta: old.meta ? { ...old.meta, totalCount: old.meta.totalCount + 1 } : old.meta,
        };
      });

      return { previous, optimisticId: optimistic.id };
    },
    onError: (error: Error, _payload, context) => {
      log.error('Create comment failed, rolling back', { error });
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      onError?.(error);
    },
    onSuccess: (comment, _payload, context) => {
      queryClient.setQueryData(queryKey, (old: { comments: DocumentComment[]; meta: unknown } | undefined) => {
        if (!old) return old;
        const replaceOptimistic = (list: DocumentComment[]): DocumentComment[] =>
          list.map((c) =>
            c.id === context?.optimisticId
              ? comment
              : { ...c, replies: replaceOptimistic(c.replies) },
          );
        return { ...old, comments: replaceOptimistic(old.comments) };
      });
      onSuccess?.(comment);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.documentLists(tenant ?? '', documentId) });
    },
  });

  return {
    createComment: mutation.mutate,
    createCommentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
