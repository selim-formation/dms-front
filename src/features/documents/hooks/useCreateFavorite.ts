/**
 * useCreateFavorite Hook
 *
 * TanStack Query hook for adding a document to favorites
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFavorite } from '../api/favorites-api';
import { favoritesKeys } from '../api/favoritesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { FavoriteData } from '../types/favorites.types';

const log = logger.createScoped('useCreateFavorite');

interface UseCreateFavoriteOptions {
    onSuccess?: (data: FavoriteData) => void;
    onError?: (error: Error) => void;
}

interface UseCreateFavoriteResult {
    mutate: (documentId: number, note?: string) => void;
    mutateAsync: (documentId: number, note?: string) => Promise<FavoriteData>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    data: FavoriteData | null;
}

export function useCreateFavorite(
    options: UseCreateFavoriteOptions = {}
): UseCreateFavoriteResult {
    const tenant = useTenantId();
    const queryClient = useQueryClient();
    const { onSuccess: onSuccessCallback, onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async ({ documentId, note }: { documentId: number; note?: string }) => {
            if (!tenant) {
                log.error('Tenant is not available for create favorite mutation');
                throw new Error('Tenant is required to add favorite');
            }

            log.info('Starting create favorite mutation', { documentId, tenant });
            return createFavorite(tenant, documentId, note);
        },
        onSuccess: (data) => {
            log.info('Create favorite mutation successful', { data });

            // Invalidate all favorites queries (list + last),
            // so any preview reflects the change without a manual reload
            if (tenant) {
                queryClient.invalidateQueries({ queryKey: favoritesKeys.all });
            }

            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            log.error('Create favorite mutation failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        mutate: (documentId: number, note?: string) => mutation.mutate({ documentId, note }),
        mutateAsync: (documentId: number, note?: string) =>
            mutation.mutateAsync({ documentId, note }),
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data ?? null,
    };
}
