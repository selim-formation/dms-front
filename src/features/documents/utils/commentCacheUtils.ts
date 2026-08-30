/**
 * Immutable helpers for updating a nested comment tree inside the TanStack
 * Query cache (top-level comments + their one level of replies).
 *
 * Untouched comments keep their exact object reference so React.memo'd
 * CommentItem siblings skip re-rendering - only the changed node (and its
 * containing array) gets a new reference.
 */
import type { DocumentComment } from '../types/comment.types';

export function mapCommentTree(
  comments: DocumentComment[],
  commentId: number,
  updater: (comment: DocumentComment) => DocumentComment,
): DocumentComment[] {
  let changed = false;

  const next = comments.map((comment) => {
    if (comment.id === commentId) {
      changed = true;
      return updater(comment);
    }

    if (comment.replies.some((reply) => reply.id === commentId)) {
      changed = true;
      return { ...comment, replies: mapCommentTree(comment.replies, commentId, updater) };
    }

    return comment;
  });

  return changed ? next : comments;
}

export function removeCommentFromTree(
  comments: DocumentComment[],
  commentId: number,
): DocumentComment[] {
  const withoutTopLevel = comments.filter((comment) => comment.id !== commentId);
  if (withoutTopLevel.length !== comments.length) return withoutTopLevel;

  return comments.map((comment) =>
    comment.replies.some((reply) => reply.id === commentId)
      ? {
          ...comment,
          replies: comment.replies.filter((reply) => reply.id !== commentId),
          replies_count: Math.max(0, comment.replies_count - 1),
        }
      : comment,
  );
}

export function prependComment(
  comments: DocumentComment[],
  comment: DocumentComment,
): DocumentComment[] {
  return [comment, ...comments];
}

export function appendReply(
  comments: DocumentComment[],
  parentId: number,
  reply: DocumentComment,
): DocumentComment[] {
  return mapCommentTree(comments, parentId, (parent) => ({
    ...parent,
    replies: [...parent.replies, reply],
    replies_count: parent.replies_count + 1,
  }));
}
