/**
 * useTeamStats Hook
 * TanStack Query hook for the team stat cards. Independent of search/filter
 * state on purpose — stats stay pinned to the full visible roster.
 */

import { useQuery } from '@tanstack/react-query';
import { teamsApiService } from '../api/teamsApi';
import { teamKeys } from '../api/teamKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { TeamStats } from '../types/team.types';

const log = logger.createScoped('useTeamStats');

interface UseTeamStatsResult {
    stats: TeamStats | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export function useTeamStats(): UseTeamStatsResult {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? teamKeys.stats(tenant) : ['teams', 'stats', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for team stats fetch');
                throw new Error('Tenant is required to fetch team stats');
            }

            return teamsApiService.fetchTeamStats(tenant);
        },
        enabled: !!tenant,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 2,
    });

    return {
        stats: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
