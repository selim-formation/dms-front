/**
 * ProfileApiService - API Service for Profile
 * Handles the aggregate profile request (user + stats + recent activity)
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type { GetProfileApiResponse, ProfileData, ProfileQueryParams } from '../types/profile.types';

const log = logger.createScoped('ProfileApiService');

export class ProfileApiService {
    private static instance: ProfileApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints;

    private constructor() {
        log.info('ProfileApiService initialized');
    }

    public static getInstance(): ProfileApiService {
        if (!ProfileApiService.instance) {
            ProfileApiService.instance = new ProfileApiService();
        }
        return ProfileApiService.instance;
    }

    /**
     * Fetch the authenticated user's aggregate profile
     */
    public async fetchProfile(
        tenant: string,
        params: ProfileQueryParams = {}
    ): Promise<ProfileData> {
        try {
            log.info(`Fetching profile for tenant: ${tenant}`, { params });

            const url = buildApiUrl(this.endpoints.profile.get, { tenant });

            const response = await this.client.get<GetProfileApiResponse>(url, { params });

            log.info('Successfully fetched profile');
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch profile', { error });
            throw error;
        }
    }
}

/**
 * Export singleton instance
 */
export const profileApiService = ProfileApiService.getInstance();
