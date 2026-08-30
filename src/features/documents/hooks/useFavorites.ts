/**
 * useFavorites Hook
 *
 * TanStack Query hook for fetching paginated favorites with caching
 */

import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../api/favorites-api';
import { favoritesKeys } from '../api/favoritesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { FavoriteData, FavoritesListParams, FavoritesMeta } from '../types/favorites.types';

const log = logger.createScoped('useFavorites');

const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseFavoritesOptions extends FavoritesListParams {
    enabled?: boolean;
}

interface UseFavoritesResult {
    favorites: FavoriteData[];
    meta: FavoritesMeta | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
    isFetching: boolean;
    isStale: boolean;
}

/**
 * Hook to fetch paginated favorites
 *
 * @param options - Pagination params (per_page, page) and enabled flag
 */
export function useFavorites(options: UseFavoritesOptions = {}): UseFavoritesResult {
    const { enabled: enabledProp = true, per_page, page } = options;
    const tenant = useTenantId();
    const params: FavoritesListParams = { per_page, page };

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? favoritesKeys.list(params) : ['favorites', 'list', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for favorites fetch');
                throw new Error('Tenant is required to fetch favorites');
            }

            log.info('Fetching favorites', { tenant, params });
            return getFavorites(tenant, params);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        favorites: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
        isStale: query.isStale,
    };
}
