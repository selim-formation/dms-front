/**
 * useCreatePinnedDocument Hook
 * 
 * TanStack Query hook for pinning a document with mutation
 * Integrates with API service and handles all mutation states
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pinDocument } from '../api/pinnedDocuments-api';
import { pinnedDocumentsKeys } from '../api/pinnedDocumentsKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { PinnedDocumentData } from '../types/pinned.types';
import type { ApiError } from '@/core/api/types';

const log = logger.createScoped('useCreatePinnedDocument');

interface UseCreatePinnedDocumentOptions {
    onSuccess?: (data: PinnedDocumentData | null) => void;
    onError?: (error: Error) => void;
}

interface UseCreatePinnedDocumentResult {
    mutate: (documentId: number) => void;
    mutateAsync: (documentId: number) => Promise<PinnedDocumentData | null>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    data: PinnedDocumentData | null;
}

/**
 * Hook to pin a document using mutation
 * 
 * Features:
 * - TanStack Query mutation for pinning documents
 * - Automatic cache invalidation on success
 * - Error handling with optional callbacks
 * - Proper loading and success states
 * 
 * @param options - Mutation options with callbacks
 * @returns Object with mutation functions and state
 */
export function useCreatePinnedDocument(
    options: UseCreatePinnedDocumentOptions = {}
): UseCreatePinnedDocumentResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async (documentId: number) => {
            if (!tenant) {
                log.error('Tenant is not available for pin document mutation');
                throw new Error('Tenant is required to pin document');
            }

            log.info('Starting pin document mutation', { documentId, tenant });
            return pinDocument(tenant, documentId);
        },
        onSuccess: (data) => {
            log.info('Pin document mutation successful', { data });

            // Invalidate all pinned documents queries (list + last),
            // so the home page preview reflects the change without a manual reload
            if (tenant) {
                queryClient.invalidateQueries({
                    queryKey: pinnedDocumentsKeys.all(tenant),
                });
            }

            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            // 409 means the document is already pinned — not a real
            // error. Resync from the server (our cache was stale) and
            // treat it as the success case instead of surfacing a toast.
            if ((error as Partial<ApiError>)?.status === 409) {
                log.info('Document already pinned (409) — resyncing instead of erroring');
                if (tenant) {
                    queryClient.invalidateQueries({ queryKey: pinnedDocumentsKeys.all(tenant) });
                }
                return;
            }

            log.error('Pin document mutation failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data ?? null,
    };
}
