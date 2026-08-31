/**
 * useUpdatePinnedDocumentOrder Hook
 *
 * TanStack Query hook for reordering a pinned document (PUT .../order).
 * Mirrors useUpdateFavorite.ts. Note: this is per-item, not bulk — a
 * drag-and-drop reorder of N items fires N of these mutations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePinnedDocumentOrder } from '../api/pinnedDocuments-api';
import { pinnedDocumentsKeys } from '../api/pinnedDocumentsKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { PinnedDocumentData } from '../types/pinned.types';

const log = logger.createScoped('useUpdatePinnedDocumentOrder');

interface UseUpdatePinnedDocumentOrderOptions {
    onSuccess?: (data: PinnedDocumentData) => void;
    onError?: (error: Error) => void;
}

interface UseUpdatePinnedDocumentOrderResult {
    mutate: (pinnedDocumentId: number, order: number) => void;
    mutateAsync: (pinnedDocumentId: number, order: number) => Promise<PinnedDocumentData>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
}

export function useUpdatePinnedDocumentOrder(
    options: UseUpdatePinnedDocumentOrderOptions = {}
): UseUpdatePinnedDocumentOrderResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async ({
            pinnedDocumentId,
            order,
        }: {
            pinnedDocumentId: number;
            order: number;
        }) => {
            if (!tenant) {
                log.error('Tenant is not available for reorder pinned document mutation');
                throw new Error('Tenant is required to reorder pinned document');
            }

            log.info('Starting reorder pinned document mutation', { pinnedDocumentId, order, tenant });
            return updatePinnedDocumentOrder(tenant, pinnedDocumentId, order);
        },
        onSuccess: (data) => {
            log.info('Reorder pinned document mutation successful', { data });

            if (tenant) {
                queryClient.invalidateQueries({ queryKey: pinnedDocumentsKeys.all(tenant) });
            }

            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            log.error('Reorder pinned document mutation failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        mutate: (pinnedDocumentId: number, order: number) =>
            mutation.mutate({ pinnedDocumentId, order }),
        mutateAsync: (pinnedDocumentId: number, order: number) =>
            mutation.mutateAsync({ pinnedDocumentId, order }),
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}
