/**
 * CommentsApiService - OOP API Service Layer
 * Handles all HTTP requests related to document comments & reactions
 *
 * Mirrors TaskApiService / ReminderApiService conventions:
 * - Singleton instance
 * - Raw axios instance (via apiClient.getInstance()) so pagination headers
 *   (X-Total-Count etc.) are available alongside the envelope body
 * - Consistent logging + error propagation
 */

import type { AxiosResponse } from 'axios';
import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { normalizeComment, normalizeComments } from '../utils/normalizeComment';
import type {
  ApiEnvelope,
  CommentReaction,
  CreateCommentPayload,
  DocumentComment,
  PaginationMeta,
  ReactionType,
  ToggleReactionResult,
  UpdateCommentPayload,
} from '../types/comment.types';

const log = logger.createScoped('CommentsApiService');

interface ListParams {
  page?: number;
  per_page?: number;
}

/**
 * This endpoint's pagination is only ever readable via response headers
 * (the JSON body is just `{data, message, status}`, no `meta`) — and in
 * practice `X-Total-Count` etc. never show up client-side either (missing
 * from `Access-Control-Expose-Headers` server-side, or never sent), so
 * `get()` below reliably comes back 0. Rather than surface a permanent
 * "Comments (0)" regardless of how many comments actually exist, fall
 * back to a lower-bound total derived from what this page returned: exact
 * whenever everything fits on one page, an undercount only once a
 * document has more comments than a single fetch's `per_page`. `lastPage`
 * likewise falls back to "one more page than this" whenever the page came
 * back full, so "load more" stays offered rather than disappearing.
 */
function extractPaginationMeta(
  headers: AxiosResponse['headers'],
  params: { page: number; per_page: number },
  dataLength: number,
): PaginationMeta {
  const get = (key: string) => Number(headers[key] ?? headers[key.toLowerCase()] ?? 0);
  const headerTotal = get('x-total-count') || get('X-Total-Count');
  const currentPage = get('x-current-page') || get('X-Current-Page') || params.page;
  const perPage = get('x-per-page') || get('X-Per-Page') || params.per_page;

  if (headerTotal > 0) {
    return {
      totalCount: headerTotal,
      perPage,
      currentPage,
      lastPage: get('x-last-page') || get('X-Last-Page') || 1,
    };
  }

  const pageIsFull = dataLength >= params.per_page;
  return {
    totalCount: (params.page - 1) * params.per_page + dataLength,
    perPage,
    currentPage,
    lastPage: pageIsFull ? currentPage + 1 : currentPage,
  };
}

export class CommentsApiService {
  private static instance: CommentsApiService;
  private readonly client = apiClient.getInstance();
  private readonly endpoints = apiEndpoints.comments;

  private constructor() {
    log.info('CommentsApiService initialized');
  }

  public static getInstance(): CommentsApiService {
    if (!CommentsApiService.instance) {
      CommentsApiService.instance = new CommentsApiService();
    }
    return CommentsApiService.instance;
  }

  /** Top-level comments for a document, replies + reactions nested. */
  public async fetchByDocument(
    tenant: string,
    documentId: number,
    params: ListParams = {},
    signal?: AbortSignal,
  ): Promise<{ comments: DocumentComment[]; meta: PaginationMeta }> {
    try {
      const url = buildApiUrl(this.endpoints.byDocument, { tenant, documentId });
      const requestParams = { page: params.page ?? 1, per_page: params.per_page ?? 20 };
      const response = await this.client.get<ApiEnvelope<DocumentComment[]>>(url, {
        params: requestParams,
        signal,
      });
      const comments = normalizeComments(response.data.data ?? []);

      return {
        comments,
        meta: extractPaginationMeta(response.headers, requestParams, comments.length),
      };
    } catch (error) {
      log.error('Failed to fetch comments by document', { documentId, error });
      throw error;
    }
  }

  /** Top-level comments scoped to one document version. */
  public async fetchByVersion(
    tenant: string,
    documentId: number,
    versionId: number,
    params: ListParams = {},
    signal?: AbortSignal,
  ): Promise<{ comments: DocumentComment[]; meta: PaginationMeta }> {
    try {
      const url = buildApiUrl(this.endpoints.byVersion, { tenant, documentId, versionId });
      const requestParams = { page: params.page ?? 1, per_page: params.per_page ?? 20 };
      const response = await this.client.get<ApiEnvelope<DocumentComment[]>>(url, {
        params: requestParams,
        signal,
      });
      const comments = normalizeComments(response.data.data ?? []);

      return {
        comments,
        meta: extractPaginationMeta(response.headers, requestParams, comments.length),
      };
    } catch (error) {
      log.error('Failed to fetch comments by version', { documentId, versionId, error });
      throw error;
    }
  }

  /** One comment fully expanded: parent, replies, reactions. */
  public async fetchThread(
    tenant: string,
    commentId: number,
    signal?: AbortSignal,
  ): Promise<DocumentComment> {
    try {
      const url = buildApiUrl(this.endpoints.thread, { tenant, commentId });
      const response = await this.client.get<ApiEnvelope<DocumentComment>>(url, { signal });
      return normalizeComment(response.data.data);
    } catch (error) {
      log.error('Failed to fetch comment thread', { commentId, error });
      throw error;
    }
  }

  /** Create a comment or a reply (set parent_id). */
  public async createComment(
    tenant: string,
    payload: CreateCommentPayload,
  ): Promise<DocumentComment> {
    try {
      const url = buildApiUrl(this.endpoints.store, { tenant });
      const response = await this.client.post<ApiEnvelope<DocumentComment>>(url, payload);
      log.info('Comment created', { id: response.data.data.id });
      return normalizeComment(response.data.data);
    } catch (error) {
      log.error('Failed to create comment', { error });
      throw error;
    }
  }

  /** Edit a comment (author only). */
  public async updateComment(
    tenant: string,
    commentId: number,
    payload: UpdateCommentPayload,
  ): Promise<DocumentComment> {
    try {
      const url = buildApiUrl(this.endpoints.update, { tenant, commentId });
      const response = await this.client.put<ApiEnvelope<DocumentComment>>(url, payload);
      return normalizeComment(response.data.data);
    } catch (error) {
      log.error('Failed to update comment', { commentId, error });
      throw error;
    }
  }

  /** Soft-delete a comment (author only). */
  public async deleteComment(tenant: string, commentId: number): Promise<void> {
    try {
      const url = buildApiUrl(this.endpoints.delete, { tenant, commentId });
      await this.client.delete(url);
      log.info('Comment deleted', { commentId });
    } catch (error) {
      log.error('Failed to delete comment', { commentId, error });
      throw error;
    }
  }

  /** Paginated reactions on one comment. */
  public async fetchReactions(
    tenant: string,
    commentId: number,
    params: ListParams = {},
    signal?: AbortSignal,
  ): Promise<{ reactions: CommentReaction[]; meta: PaginationMeta }> {
    try {
      const url = buildApiUrl(this.endpoints.reactions, { tenant, commentId });
      const requestParams = { page: params.page ?? 1, per_page: params.per_page ?? 20 };
      const response = await this.client.get<ApiEnvelope<CommentReaction[]>>(url, {
        params: requestParams,
        signal,
      });
      const reactions = response.data.data ?? [];

      return {
        reactions,
        meta: extractPaginationMeta(response.headers, requestParams, reactions.length),
      };
    } catch (error) {
      log.error('Failed to fetch reactions', { commentId, error });
      throw error;
    }
  }

  /** Toggle a reaction: creates it if absent, removes it if the same user+type already exists. */
  public async toggleReaction(
    tenant: string,
    commentId: number,
    reaction: ReactionType,
  ): Promise<ToggleReactionResult> {
    try {
      const url = buildApiUrl(this.endpoints.toggleReaction, { tenant, commentId });
      const response = await this.client.post<ApiEnvelope<CommentReaction | null>>(url, {
        reaction,
      });

      return {
        reaction: response.data.data,
        removed: response.data.data === null,
      };
    } catch (error) {
      log.error('Failed to toggle reaction', { commentId, reaction, error });
      throw error;
    }
  }
}

export const commentsApiService = CommentsApiService.getInstance();
