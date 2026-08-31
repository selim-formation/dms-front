/**
 * TeamsApiService — API Service for the Team roster
 * Handles all HTTP requests related to GET /{tenant}/teams and /teams/stats
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type {
    GetTeamMembersApiResponse,
    GetTeamStatsApiResponse,
    TeamListParams,
    TeamMembersPaginatedData,
    TeamStats,
} from '../types/team.types';

const log = logger.createScoped('TeamsApiService');

export class TeamsApiService {
    private static instance: TeamsApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.teams;

    private constructor() {
        log.info('TeamsApiService initialized');
    }

    public static getInstance(): TeamsApiService {
        if (!TeamsApiService.instance) {
            TeamsApiService.instance = new TeamsApiService();
        }
        return TeamsApiService.instance;
    }

    /**
     * Paginated roster of the current user's visible colleagues.
     * Filtering (search/department_id/section_id) happens server-side.
     */
    public async fetchTeamMembers(
        tenant: string,
        params: TeamListParams = {},
    ): Promise<TeamMembersPaginatedData> {
        try {
            log.info(`Fetching team members for tenant: ${tenant}`, { params });

            const url = buildApiUrl(this.endpoints.list, { tenant });
            const response = await this.client.get<GetTeamMembersApiResponse>(url, {
                params: {
                    search: params.search || undefined,
                    department_id: params.department_id,
                    section_id: params.section_id,
                    per_page: params.per_page ?? 15,
                    page: params.page ?? 1,
                },
            });

            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch team members', { error });
            throw error;
        }
    }

    /**
     * Stat cards — computed over the same visible roster as the list,
     * not the whole tenant. No query params.
     */
    public async fetchTeamStats(tenant: string): Promise<TeamStats> {
        try {
            log.info(`Fetching team stats for tenant: ${tenant}`);

            const url = buildApiUrl(this.endpoints.stats, { tenant });
            const response = await this.client.get<GetTeamStatsApiResponse>(url);

            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch team stats', { error });
            throw error;
        }
    }
}

export const teamsApiService = TeamsApiService.getInstance();
