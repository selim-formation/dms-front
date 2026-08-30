/**
 * useUpdateFavorite Hook
 *
 * TanStack Query hook for editing a favorite's note
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFavorite } from '../api/favorites-api';
import { favoritesKeys } from '../api/favoritesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { FavoriteData } from '../types/favorites.types';

const log = logger.createScoped('useUpdateFavorite');

interface UseUpdateFavoriteOptions {
    onSuccess?: (data: FavoriteData) => void;
    onError?: (error: Error) => void;
}

interface UseUpdateFavoriteResult {
    mutate: (favoriteId: number, note: string) => void;
    mutateAsync: (favoriteId: number, note: string) => Promise<FavoriteData>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
}

export function useUpdateFavorite(
    options: UseUpdateFavoriteOptions = {}
): UseUpdateFavoriteResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async ({ favoriteId, note }: { favoriteId: number; note: string }) => {
            if (!tenant) {
                log.error('Tenant is not available for update favorite mutation');
                throw new Error('Tenant is required to update favorite');
            }

            log.info('Starting update favorite mutation', { favoriteId, tenant });
            return updateFavorite(tenant, favoriteId, note);
        },
        onSuccess: (data) => {
            log.info('Update favorite mutation successful', { data });

            if (tenant) {
                queryClient.invalidateQueries({ queryKey: favoritesKeys.all });
            }

            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            log.error('Update favorite mutation failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        mutate: (favoriteId: number, note: string) => mutation.mutate({ favoriteId, note }),
        mutateAsync: (favoriteId: number, note: string) =>
            mutation.mutateAsync({ favoriteId, note }),
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
}
