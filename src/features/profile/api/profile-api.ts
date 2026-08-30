/**
 * Profile API Functions
 * Thin functional wrapper around ProfileApiService
 */

import { profileApiService } from './profileApi';
import { logger } from '@/shared/utils/logger';
import type { ProfileData, ProfileQueryParams } from '../types/profile.types';

const log = logger.createScoped('profileApi');

export async function getProfile(
    tenant: string,
    params: ProfileQueryParams = {}
): Promise<ProfileData> {
    try {
        log.info('Fetching profile from API', { tenant, params });
        const profile = await profileApiService.fetchProfile(tenant, params);
        log.info('Successfully fetched profile');
        return profile;
    } catch (error) {
        log.error('Failed to fetch profile', { error });
        throw error;
    }
}
