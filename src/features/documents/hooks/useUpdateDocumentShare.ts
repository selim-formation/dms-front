/**
 * useUpdateDocumentShare Hook
 *
 * TanStack Query mutation hook for patching an existing share
 * (access flags and/or schedule). Only the granter may update.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShare } from '../api/documentShares-api';
import { documentSharesKeys } from '../api/documentSharesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { DocumentShareData, UpdateDocumentSharePayload } from '../types/documentShare.types';

const log = logger.createScoped('useUpdateDocumentShare');

interface UseUpdateDocumentShareOptions {
    onSuccess?: (data: DocumentShareData) => void;
    onError?: (error: Error) => void;
}

interface UseUpdateDocumentShareResult {
    mutate: (shareId: number, payload: UpdateDocumentSharePayload) => void;
    mutateAsync: (shareId: number, payload: UpdateDocumentSharePayload) => Promise<DocumentShareData>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    reset: () => void;
}

export function useUpdateDocumentShare(
    options: UseUpdateDocumentShareOptions = {}
): UseUpdateDocumentShareResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async ({
            shareId,
            payload,
        }: {
            shareId: number;
            payload: UpdateDocumentSharePayload;
        }) => {
            if (!tenant) {
                log.error('Tenant is not available for update share mutation');
                throw new Error('Tenant is required to update a share');
            }
            return updateShare(tenant, shareId, payload);
        },
        onSuccess: (data) => {
            log.info('Update share mutation successful', { data });
            if (tenant) {
                queryClient.invalidateQueries({ queryKey: documentSharesKeys.all });
            }
            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            log.error('Update share mutation failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        mutate: (shareId, payload) => mutation.mutate({ shareId, payload }),
        mutateAsync: (shareId, payload) => mutation.mutateAsync({ shareId, payload }),
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}
