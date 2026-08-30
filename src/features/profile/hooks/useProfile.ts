/**
 * useProfile Hook
 * TanStack Query hook for the aggregate profile endpoint
 */

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profile-api';
import { profileKeys } from '../api/profileKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { ProfileData } from '../types/profile.types';

const log = logger.createScoped('useProfile');

const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseProfileOptions {
    recentLimit?: number;
    enabled?: boolean;
}

interface UseProfileResult {
    profile: ProfileData | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
    isFetching: boolean;
}

export function useProfile(options: UseProfileOptions = {}): UseProfileResult {
    const { recentLimit = 5, enabled: enabledProp = true } = options;
    const tenant = useTenantId();
    const params = { recent_limit: recentLimit };

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? profileKeys.detail(params) : ['profile', 'detail', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for profile fetch');
                throw new Error('Tenant is required to fetch profile');
            }

            log.info('Fetching profile', { tenant, params });
            return getProfile(tenant, params);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        profile: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
    };
}
