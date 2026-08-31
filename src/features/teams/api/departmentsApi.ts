/**
 * DepartmentsApiService — used to populate the team filter chip row
 * (GET /{tenant}/departments, reused rather than a new endpoint)
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type { GetDepartmentsApiResponse, TeamDepartment } from '../types/team.types';

const log = logger.createScoped('DepartmentsApiService');

export async function getDepartments(tenant: string): Promise<TeamDepartment[]> {
    try {
        log.info(`Fetching departments for tenant: ${tenant}`);

        const url = buildApiUrl(apiEndpoints.departments.list, { tenant });
        const response = await apiClient.getInstance().get<GetDepartmentsApiResponse>(url);

        return response.data.data ?? [];
    } catch (error) {
        log.error('Failed to fetch departments', { error });
        throw error;
    }
}
