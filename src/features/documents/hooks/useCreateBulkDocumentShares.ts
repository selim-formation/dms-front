/**
 * useCreateBulkDocumentShares Hook
 *
 * Mutation for sharing a document with many users/departments/sections in
 * one request. Returns one share per target; the shares lists are refetched.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBulkShares } from '../api/documentShares-api';
import { documentSharesKeys } from '../api/documentSharesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { BulkCreateDocumentSharePayload, DocumentShareData } from '../types/documentShare.types';

const log = logger.createScoped('useCreateBulkDocumentShares');

interface UseCreateBulkDocumentSharesOptions {
    onSuccess?: (data: DocumentShareData[]) => void;
    onError?: (error: Error) => void;
}

export function useCreateBulkDocumentShares(options: UseCreateBulkDocumentSharesOptions = {}) {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async (payload: BulkCreateDocumentSharePayload) => {
            if (!tenant) {
                log.error('Tenant is not available for bulk share mutation');
                throw new Error('Tenant is required to share a document');
            }
            return createBulkShares(tenant, payload);
        },
        onSuccess: (data) => {
            log.info('Bulk share mutation successful', { count: data.length });
            queryClient.invalidateQueries({ queryKey: documentSharesKeys.all });
            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            log.error('Bulk share mutation failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
        reset: mutation.reset,
    };
}
