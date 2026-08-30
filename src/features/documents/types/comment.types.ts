/**
 * Document Comments & Reactions - Types
 * Mirrors the API envelope documented in the Document Comments API guide.
 */

export type ReactionType = 'like' | 'approve' | 'reject' | 'helpful';

export interface CommentAuthor {
  id: number;
  name: string;
  email?: string;
}

export interface CommentReaction {
  id: number;
  comment_id: number;
  user_id: number;
  reaction: ReactionType;
  author: CommentAuthor;
  is_positive: boolean;
  is_negative: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentComment {
  id: number;
  content: string;
  document_id: number;
  document_version_id: number | null;
  user_id: number;
  parent_id: number | null;
  mentions: number[] | null;
  attachments: unknown[] | null;
  author: CommentAuthor;
  parent: DocumentComment | null;
  replies: DocumentComment[];
  reactions: CommentReaction[];
  reactions_count: number;
  replies_count: number;
  created_at: string; // "d/m/Y H:i"
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiEnvelope<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginationMeta {
  totalCount: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface PaginatedComments {
  comments: DocumentComment[];
  meta: PaginationMeta;
}

export interface PaginatedReactions {
  reactions: CommentReaction[];
  meta: PaginationMeta;
}

export interface CreateCommentPayload {
  content: string;
  document_id: number;
  document_version_id?: number;
  parent_id?: number;
  mentions?: number[];
  attachments?: unknown[];
}

export interface UpdateCommentPayload {
  content?: string;
  mentions?: number[];
  attachments?: unknown[];
}

/** Result of the toggle-reaction endpoint: null data means the reaction was removed. */
export interface ToggleReactionResult {
  reaction: CommentReaction | null;
  removed: boolean;
}
