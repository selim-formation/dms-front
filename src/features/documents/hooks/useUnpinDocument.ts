/**
 * useUnpinDocument Hook
 * 
 * TanStack Query hook for unpinning a document with mutation
 * Integrates with API service and handles all mutation states
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unpinDocument } from '../api/pinnedDocuments-api';
import { pinnedDocumentsKeys } from '../api/pinnedDocumentsKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('useUnpinDocument');

interface UseUnpinDocumentOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface UseUnpinDocumentResult {
    mutate: (pinnedDocumentId: number) => void;
    mutateAsync: (pinnedDocumentId: number) => Promise<void>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
}

/**
 * Hook to unpin a document using mutation
 * 
 * Features:
 * - TanStack Query mutation for unpinning documents
 * - Automatic cache invalidation on success
 * - Error handling with optional callbacks
 * - Proper loading and success states
 * 
 * @param options - Mutation options with callbacks
 * @returns Object with mutation functions and state
 */
export function useUnpinDocument(
    options: UseUnpinDocumentOptions = {}
): UseUnpinDocumentResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async (pinnedDocumentId: number) => {
            if (!tenant) {
                log.error('Tenant is not available for unpin document mutation');
                throw new Error('Tenant is required to unpin document');
            }

            log.info('Starting unpin document mutation', { pinnedDocumentId, tenant });
            return unpinDocument(tenant, pinnedDocumentId);
        },
        onSuccess: () => {
            log.info('Unpin document mutation successful');
            
            // Invalidate all pinned documents queries (list + last),
            // so the home page preview reflects the change without a manual reload
            if (tenant) {
                queryClient.invalidateQueries({
                    queryKey: pinnedDocumentsKeys.all,
                });
            }
            
            onSuccessCallback?.();
        },
        onError: (error: Error) => {
            log.error('Unpin document mutation failed', { error });
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
    };
}
