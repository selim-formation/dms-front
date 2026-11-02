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
import { profileKeys } from '@/features/profile/api/profileKeys';
import type { FavoriteData, FavoritesPaginatedData } from '../types/favorites.types';
import type { ApiError } from '@/core/api/types';

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

            if (tenant) {
                // Patch cached lists first so every star icon flips immediately
                // instead of waiting on (or losing to) a refetch round-trip.
                queryClient.setQueriesData<FavoritesPaginatedData>(
                    { queryKey: favoritesKeys.lists(tenant) },
                    (old) => {
                        if (!old || !data?.document) return old;
                        if (old.data.some((f) => f.document.id === data.document.id)) return old;
                        return {
                            ...old,
                            data: [data, ...old.data],
                            meta: { ...old.meta, total: old.meta.total + 1 },
                        };
                    }
                );
                // Lists are already patched: mark stale for next mount only.
                queryClient.invalidateQueries({
                    queryKey: favoritesKeys.lists(tenant),
                    refetchType: 'none',
                });
                // "Last" previews are server-ordered subsets: refetch them.
                queryClient.invalidateQueries({ queryKey: favoritesKeys.lasts(tenant) });
            }
            queryClient.invalidateQueries({ queryKey: profileKeys.all });

            onSuccessCallback?.(data);
        },
        onError: (error: Error) => {
            // 409 means the document is already favorited — not a real
            // error. Resync from the server (our cache was stale) and
            // treat it as the success case instead of surfacing a toast.
            if ((error as Partial<ApiError>)?.status === 409) {
                log.info('Document already favorited (409) — resyncing instead of erroring');
                if (tenant) {
                    queryClient.invalidateQueries({ queryKey: favoritesKeys.all(tenant) });
                }
                return;
            }

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
