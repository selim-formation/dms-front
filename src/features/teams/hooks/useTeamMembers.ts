/**
 * useTeamMembers Hook
 * TanStack Query hook for the paginated, filtered team roster.
 */

import { useQuery } from '@tanstack/react-query';
import { teamsApiService } from '../api/teamsApi';
import { teamKeys } from '../api/teamKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { TeamListParams, TeamMember, PaginationMeta } from '../types/team.types';

const log = logger.createScoped('useTeamMembers');

const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseTeamMembersOptions extends TeamListParams {
    enabled?: boolean;
}

interface UseTeamMembersResult {
    members: TeamMember[];
    meta: PaginationMeta | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
    isFetching: boolean;
}

export function useTeamMembers(options: UseTeamMembersOptions = {}): UseTeamMembersResult {
    const { enabled: enabledProp = true, ...params } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? teamKeys.list(tenant, params) : ['teams', 'list', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for team members fetch');
                throw new Error('Tenant is required to fetch team members');
            }

            return teamsApiService.fetchTeamMembers(tenant, params);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        members: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
    };
}
