/**
 * useCreateDocumentShare Hook
 *
 * TanStack Query mutation hook for granting a document share.
 * Re-posting the same document_id + shared_with pair updates/reactivates
 * the existing share instead of erroring.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShare } from '../api/documentShares-api';
import { documentSharesKeys } from '../api/documentSharesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { CreateDocumentSharePayload, DocumentShareData } from '../types/documentShare.types';

const log = logger.createScoped('useCreateDocumentShare');

interface UseCreateDocumentShareOptions {
    onSuccess?: (data: DocumentShareData) => void;
    onError?: (error: Error) => void;
}

interface UseCreateDocumentShareResult {
    mutate: (payload: CreateDocumentSharePayload) => void;
    mutateAsync: (payload: CreateDocumentSharePayload) => Promise<DocumentShareData>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    reset: () => void;
}

export function useCreateDocumentShare(
    options: UseCreateDocumentShareOptions = {}
): UseCreateDocumentShareResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async (payload: CreateDocumentSharePayload) => {
            if (!tenant) {
                log.error('Tenant is not available for create share mutation');
                throw new Error('Tenant is required to share a document');
            }
            return createShare(tenant, payload);
        },
        onSuccess: (data) => {
            log.info('Create share mutation successful', { data });
            if (tenant) {
                queryClient.invalidateQueries({ queryKey: documentSharesKeys.all });
            }
            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            log.error('Create share mutation failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        mutate: (payload) => mutation.mutate(payload),
        mutateAsync: (payload) => mutation.mutateAsync(payload),
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}
