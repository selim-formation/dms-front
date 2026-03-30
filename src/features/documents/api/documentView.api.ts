/**
 * Document View API Service
 * Handles API calls for fetching a single document with full details
 */

import { apiClient } from '@/core/api/client';
import type { DocumentViewResponse, DocumentViewData } from '../types/api.types';

/**
 * API service for document view operations
 * Provides type-safe methods for fetching detailed document information
 */
export const documentViewApiService = {
    /**
     * Fetch a single document with full details (view endpoint)
     * Endpoint: GET /api/{tenant}/documents/{id}/view
     *
     * @param tenant - Tenant identifier (e.g., 'bisco-misr')
     * @param documentId - Document ID to fetch
     * @param signal - AbortSignal for request cancellation
     * @returns Promise with document details
     *
     * @example
     * ```tsx
     * const response = await documentViewApiService.getDocumentView('bisco-misr', 1);
     * const document = response[0]; // Extract first item from data array
     * ```
     */
    async getDocumentView(
        tenant: string,
        documentId: number,
        signal?: AbortSignal,
    ): Promise<DocumentViewData> {
        try {
            const response = await apiClient.get<DocumentViewResponse>(
                `/api/${tenant}/documents/${documentId}/view`,
                { signal }
            );

            // API returns data as an array, extract the first document
            if (!response.data || response.data.length === 0) {
                throw new Error('Document not found in response');
            }

            console.log(`[documentViewApiService] Fetched document ${documentId}`, {
                title: response.data[0].title,
                version: response.data[0].version,
            });

            return response.data[0];
        } catch (error) {
            console.error(`[documentViewApiService] Error fetching document ${documentId}:`, error);
            throw error;
        }
    },
};
