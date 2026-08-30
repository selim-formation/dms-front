/**
 * useLastFavorites Hook
 *
 * TanStack Query hook for fetching last favorites with caching
 * Used by the home page favorites widget
 */

import { useQuery } from '@tanstack/react-query';
import { getLastFavorites } from '../api/favorites-api';
import { favoritesKeys } from '../api/favoritesKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { FavoriteData } from '../types/favorites.types';

const log = logger.createScoped('useLastFavorites');

const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseLastFavoritesOptions {
    enabled?: boolean;
}

interface UseLastFavoritesResult {
    favorites: FavoriteData[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
    isFetching: boolean;
    isStale: boolean;
}

export function useLastFavorites(options: UseLastFavoritesOptions = {}): UseLastFavoritesResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? favoritesKeys.last() : ['favorites', 'last', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for last favorites fetch');
                throw new Error('Tenant is required to fetch last favorites');
            }

            log.info('Fetching last favorites', { tenant });
            return getLastFavorites(tenant);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        favorites: Array.isArray(query.data) ? query.data : [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
        isStale: query.isStale,
    };
}
