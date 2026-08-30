/**
 * Guarantees a full DocumentComment shape regardless of which endpoint
 * returned it. Not every response nests `replies`/`reactions` (the store/
 * update responses in particular may omit them) - components assume arrays
 * are always arrays, so normalize once at the API boundary instead of
 * defensive-checking everywhere downstream.
 */
import type { DocumentComment } from '../types/comment.types';

type RawComment = Partial<DocumentComment> & { id: number };

export function normalizeComment(raw: RawComment): DocumentComment {
  return {
    id: raw.id,
    content: raw.content ?? '',
    document_id: raw.document_id ?? 0,
    document_version_id: raw.document_version_id ?? null,
    user_id: raw.user_id ?? raw.author?.id ?? 0,
    parent_id: raw.parent_id ?? null,
    mentions: raw.mentions ?? null,
    attachments: raw.attachments ?? null,
    author: raw.author ?? { id: raw.user_id ?? 0, name: 'Unknown' },
    parent: raw.parent ? normalizeComment(raw.parent) : null,
    replies: (raw.replies ?? []).map(normalizeComment),
    reactions: raw.reactions ?? [],
    reactions_count: raw.reactions_count ?? raw.reactions?.length ?? 0,
    replies_count: raw.replies_count ?? raw.replies?.length ?? 0,
    created_at: raw.created_at ?? '',
    updated_at: raw.updated_at ?? raw.created_at ?? '',
    deleted_at: raw.deleted_at ?? null,
  };
}

export function normalizeComments(raw: RawComment[]): DocumentComment[] {
  return raw.map(normalizeComment);
}
