/**
 * useDeleteFavorite Hook
 *
 * TanStack Query hook for removing a document from favorites
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFavorite } from '../api/favorites-api';
import { favoritesKeys } from '../api/favoritesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('useDeleteFavorite');

interface UseDeleteFavoriteOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface UseDeleteFavoriteResult {
    mutate: (favoriteId: number) => void;
    mutateAsync: (favoriteId: number) => Promise<void>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
}

export function useDeleteFavorite(
    options: UseDeleteFavoriteOptions = {}
): UseDeleteFavoriteResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async (favoriteId: number) => {
            if (!tenant) {
                log.error('Tenant is not available for delete favorite mutation');
                throw new Error('Tenant is required to remove favorite');
            }

            log.info('Starting delete favorite mutation', { favoriteId, tenant });
            return deleteFavorite(tenant, favoriteId);
        },
        onSuccess: () => {
            log.info('Delete favorite mutation successful');

            if (tenant) {
                queryClient.invalidateQueries({ queryKey: favoritesKeys.all });
            }

            onSuccessCallback?.();
        },
        onError: (error: Error) => {
            log.error('Delete favorite mutation failed', { error });
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
