/**
 * useCommentThread Hook
 * One comment fully expanded (parent + replies + reactions) - for deep-linking
 * to a single comment/notification.
 */

import { useQuery } from '@tanstack/react-query';
import { commentsApiService } from '../api/CommentsApiService';
import { commentKeys } from '../api/commentKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

const QUERY_CONFIG = {
  staleTime: 30 * 1000,
  gcTime: 10 * 60 * 1000,
  retry: 1,
  retryDelay: 1000,
} as const;

export function useCommentThread(commentId: number, options: { enabled?: boolean } = {}) {
  const tenant = useTenantId();
  const enabled = (options.enabled ?? true) && !!tenant && !!commentId;

  return useQuery({
    queryKey: tenant ? commentKeys.thread(tenant, commentId) : ['comments', 'thread', 'pending'],
    queryFn: async ({ signal }) => {
      if (!tenant) throw new Error('Tenant is required to fetch comment thread');
      return commentsApiService.fetchThread(tenant, commentId, signal);
    },
    enabled,
    ...QUERY_CONFIG,
  });
}
