/**
 * useToggleReaction Hook
 * Adds/removes a reaction on a comment. The single most re-render-sensitive
 * interaction in this feature (click must feel instant) - fully optimistic,
 * only the touched comment's object reference changes so sibling
 * React.memo'd CommentItems never re-render.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApiService } from '../api/CommentsApiService';
import { commentKeys } from '../api/commentKeys';
import { mapCommentTree } from '../utils/commentCacheUtils';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { useUser } from '@/core/auth/hooks/useAuth';
import { logger } from '@/shared/utils/logger';
import type { CommentReaction, DocumentComment, ReactionType } from '../types/comment.types';

const log = logger.createScoped('useToggleReaction');

interface UseToggleReactionOptions {
  documentId: number;
  documentVersionId?: number;
  page?: number;
  perPage?: number;
  onError?: (error: Error) => void;
}

interface ToggleReactionVars {
  commentId: number;
  reaction: ReactionType;
}

function toggleReactionInList(
  reactions: CommentReaction[],
  commentId: number,
  reaction: ReactionType,
  userId: number,
  userName: string,
): CommentReaction[] {
  const existing = reactions.find((r) => r.reaction === reaction && r.user_id === userId);
  if (existing) {
    return reactions.filter((r) => r.id !== existing.id);
  }

  const optimistic: CommentReaction = {
    id: -Date.now(),
    comment_id: commentId,
    user_id: userId,
    reaction,
    author: { id: userId, name: userName },
    is_positive: reaction !== 'reject',
    is_negative: reaction === 'reject',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return [...reactions, optimistic];
}

export function useToggleReaction(options: UseToggleReactionOptions) {
  const { documentId, documentVersionId, page = 1, perPage = 20, onError } = options;
  const tenant = useTenantId();
  const user = useUser();
  const queryClient = useQueryClient();

  const queryKey = documentVersionId
    ? commentKeys.byVersion(tenant ?? '', documentId, documentVersionId, page, perPage)
    : commentKeys.byDocument(tenant ?? '', documentId, page, perPage);

  const mutation = useMutation({
    mutationFn: async ({ commentId, reaction }: ToggleReactionVars) => {
      if (!tenant) throw new Error('Tenant is required to react to a comment');
      return commentsApiService.toggleReaction(tenant, commentId, reaction);
    },
    onMutate: async ({ commentId, reaction }) => {
      if (!tenant || !user) return;
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<{ comments: DocumentComment[]; meta: unknown }>(
        queryKey,
      );
      const userId = Number(user.id);

      queryClient.setQueryData(queryKey, (old: typeof previous) => {
        if (!old) return old;
        return {
          ...old,
          comments: mapCommentTree(old.comments, commentId, (c) => {
            const nextReactions = toggleReactionInList(
              c.reactions,
              commentId,
              reaction,
              userId,
              user.name,
            );
            return { ...c, reactions: nextReactions, reactions_count: nextReactions.length };
          }),
        };
      });

      return { previous };
    },
    onError: (error: Error, _vars, context) => {
      log.error('Toggle reaction failed, rolling back', { error });
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      onError?.(error);
    },
    onSuccess: ({ reaction: serverReaction, removed }, { commentId, reaction }) => {
      if (!user) return;
      const userId = Number(user.id);

      queryClient.setQueryData(queryKey, (old: { comments: DocumentComment[]; meta: unknown } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          comments: mapCommentTree(old.comments, commentId, (c) => {
            // Drop any optimistic placeholder for this user+type, then apply server truth.
            const withoutOptimistic = c.reactions.filter(
              (r) => !(r.reaction === reaction && r.user_id === userId),
            );
            const nextReactions =
              removed || !serverReaction ? withoutOptimistic : [...withoutOptimistic, serverReaction];
            return { ...c, reactions: nextReactions, reactions_count: nextReactions.length };
          }),
        };
      });
    },
  });

  return {
    toggleReaction: mutation.mutate,
    isPending: mutation.isPending,
    pendingVariables: mutation.variables,
  };
}
