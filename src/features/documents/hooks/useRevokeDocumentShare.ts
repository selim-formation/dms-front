/**
 * useRevokeDocumentShare Hook
 *
 * TanStack Query mutation hook for soft-revoking a share.
 * Only the granter may revoke.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeShare } from '../api/documentShares-api';
import { documentSharesKeys } from '../api/documentSharesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('useRevokeDocumentShare');

interface UseRevokeDocumentShareOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface UseRevokeDocumentShareResult {
    mutate: (shareId: number) => void;
    mutateAsync: (shareId: number) => Promise<void>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
}

export function useRevokeDocumentShare(
    options: UseRevokeDocumentShareOptions = {}
): UseRevokeDocumentShareResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async (shareId: number) => {
            if (!tenant) {
                log.error('Tenant is not available for revoke share mutation');
                throw new Error('Tenant is required to revoke a share');
            }
            return revokeShare(tenant, shareId);
        },
        onSuccess: () => {
            log.info('Revoke share mutation successful');
            if (tenant) {
                queryClient.invalidateQueries({ queryKey: documentSharesKeys.all });
            }
            onSuccessCallback?.();
        },
        onError: (error: Error) => {
            log.error('Revoke share mutation failed', { error });
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
