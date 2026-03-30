/**
 * Documents List API Service
 * Handles all API calls for fetching paginated documents
 */

import { apiClient } from '@/core/api/client';
import type { ApiDocument, DocumentListParams, DocumentListData, DocumentListResponse } from '../types/api.types';

/**
 * API service for documents list operations
 * Provides type-safe methods for fetching documents with pagination and filtering
 */
export const documentListApiService = {
    /**
     * Fetch paginated documents list
     * @param tenant - Tenant identifier (e.g., 'bisco-misr')
     * @param params - Query parameters for filtering and pagination
     * @returns Promise with paginated documents
     *
     * @example
     * ```tsx
     * const response = await documentListApiService.getDocuments('bisco-misr', {
     *   page: 1,
     *   per_page: 15,
     *   sort_by: 'created_at',
     *   sort_dir: 'desc'
     * });
     * ```
     */
    async getDocuments(
        tenant: string,
        params?: DocumentListParams,
        signal?: AbortSignal,
    ): Promise<DocumentListData> {
        try {
            // apiClient.get<T>() returns Promise<T>, so response is of type DocumentListResponse
            const response = await apiClient.get<DocumentListResponse>(
                `/api/${tenant}/documents`,
                {
                    params: {
                        page: params?.page ?? 1,
                        per_page: params?.per_page ?? 15,
                        sort_by: params?.sort_by ?? 'created_at',
                        sort_dir: params?.sort_dir ?? 'desc',
                        // Add filter parameters if provided
                        ...(params?.search && { search: params.search }),
                        ...(params?.category && { category_id: params.category }),
                        ...(params?.department && { department_id: params.department }),
                        ...(params?.importance && { importance: params.importance }),
                        ...(params?.entity && { entity_id: params.entity }),
                    },
                    signal,
                },
            );

            // response is DocumentListResponse = { data: DocumentListData, message: string }
            // So response.data is the DocumentListData object
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch documents for tenant ${tenant}:`, error);
            throw error;
        }
    },

    /**
     * Fetch a single document by ID
     * @param tenant - Tenant identifier
     * @param documentId - Document ID to fetch
     * @returns Promise with document details
     */
    async getDocument(
        tenant: string,
        documentId: number,
        signal?: AbortSignal,
    ): Promise<ApiDocument> {
        // response is of type DocumentListResponse = { data: DocumentListData, message: string }
        const response = await apiClient.get<DocumentListResponse>(
            `/api/${tenant}/documents/${documentId}`,
            { signal },
        );
        // response.data is DocumentListData = { data: ApiDocument[], links, meta }
        const documents = response.data.data;
        if (!documents || documents.length === 0) {
            throw new Error(`Document ${documentId} not found`);
        }
        return documents[0];
    },

    /**
     * Search documents by query string
     * @param tenant - Tenant identifier
     * @param query - Search query string
     * @param page - Page number for pagination
     * @returns Promise with search results
     */
    async searchDocuments(
        tenant: string,
        query: string,
        page: number = 1,
        signal?: AbortSignal,
    ): Promise<DocumentListData> {
        return this.getDocuments(
            tenant,
            {
                page,
                per_page: 15,
                search: query,
            },
            signal,
        );
    },
};
