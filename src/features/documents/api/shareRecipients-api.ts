/**
 * Share Recipients API
 * Searches org users to populate the "share with" picker.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type { ShareRecipientUser } from '../types/documentShare.types';

const log = logger.createScoped('shareRecipientsApi');

interface UsersListApiResponse {
    data: ShareRecipientUser[] | { data: ShareRecipientUser[] };
    message?: string;
}

export async function searchShareRecipients(
    tenant: string,
    search: string,
    signal?: AbortSignal
): Promise<ShareRecipientUser[]> {
    try {
        const url = buildApiUrl(apiEndpoints.users.list, { tenant });
        const client = apiClient.getInstance();
        const response = await client.get<UsersListApiResponse>(url, {
            params: { search, per_page: 10 },
            signal,
        });

        const payload = response.data?.data;
        if (!payload) return [];

        // Backend may return a plain array or a paginated { data: [...] } shape
        return Array.isArray(payload) ? payload : (payload.data ?? []);
    } catch (error) {
        log.error('Failed to search share recipients', { error });
        throw error;
    }
}
