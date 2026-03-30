import { apiClient } from '@/core/api/client';
import type { DocumentSearchApiResponse, DocumentSearchParams } from '../types/search.types';

export const documentsSearchApiService = {

    async searchDocuments(
        tenant: string,
        params: DocumentSearchParams,
        signal?: AbortSignal,
    ): Promise<DocumentSearchApiResponse> {
        const response = await apiClient.post<DocumentSearchApiResponse>(
            `/api/${tenant}/documents/search`,
            params,
            { signal },
        );

        return response;
    },

}