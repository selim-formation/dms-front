/**
 * PinnedDocumentsApiService - API Service for Pinned Documents
 * Handles all HTTP requests related to pinned documents
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type {
    GetPinnedDocumentApiResponse,
    GetPinnedDocumentsApiResponse,
    PinnedDocumentData,
    PinnedDocumentsListParams,
    PinDocumentApiResponse,
    UnpinDocumentApiResponse,
    UpdatePinnedDocumentOrderApiResponse,
} from '../types/pinned.types';

const log = logger.createScoped('PinnedDocumentsApiService');

/**
 * PinnedDocumentsApiService class - Singleton pattern
 * Encapsulates all pinned documents related API operations
 */
export class PinnedDocumentsApiService {
    private static instance: PinnedDocumentsApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints;

    /**
     * Private constructor for singleton pattern
     */
    private constructor() {
        log.info('PinnedDocumentsApiService initialized');
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): PinnedDocumentsApiService {
        if (!PinnedDocumentsApiService.instance) {
            PinnedDocumentsApiService.instance = new PinnedDocumentsApiService();
        }
        return PinnedDocumentsApiService.instance;
    }

    /**
     * Fetch all pinned documents for a tenant
     * @param tenant - Tenant identifier
     * @returns Promise with array of pinned documents
     */
    public async fetchPinnedDocuments(
        tenant: string,
        params: PinnedDocumentsListParams = {}
    ): Promise<PinnedDocumentData[]> {
        try {
            log.info(`Fetching pinned documents for tenant: ${tenant}`, { params });

            const url = buildApiUrl(this.endpoints.pinnedDocuments.list, { tenant });

            const response = await this.client.get<GetPinnedDocumentsApiResponse>(url, {
                params,
            });

            if (!response.data || !response.data.data || !response.data.data.data) {
                log.warn('Empty response received from pinned documents API');
                return [];
            }

            log.info(
                `Successfully fetched ${response.data.data.data.length} pinned documents`
            );
            return response.data.data.data;
        } catch (error) {
            log.error('Failed to fetch pinned documents', { error });
            throw error;
        }
    }

    /**
     * Fetch last pinned documents for a tenant
     * @param tenant - Tenant identifier
     * @returns Promise with array of last pinned documents
     */
    public async fetchLastPinnedDocuments(
        tenant: string
    ): Promise<PinnedDocumentData[]> {
        try {
            log.info(`Fetching last pinned documents for tenant: ${tenant}`);

            const url = buildApiUrl(this.endpoints.pinnedDocuments.last, { tenant });

            const response = await this.client.get<GetPinnedDocumentsApiResponse>(url);

            if (!response.data || !response.data.data || !response.data.data.data) {
                log.warn('Empty response received from last pinned documents API');
                return [];
            }

            log.info(
                `Successfully fetched ${response.data.data.data.length} last pinned documents`
            );
            return response.data.data.data;
        } catch (error) {
            log.error('Failed to fetch last pinned documents', { error });
            throw error;
        }
    }

    /**
     * Pin a document for a tenant
     * @param tenant - Tenant identifier
     * @param documentId - Document ID to pin
     * @returns Promise with pinned document data or null if already pinned
     */
    public async pinDocument(
        tenant: string,
        documentId: number
    ): Promise<PinnedDocumentData | null> {
        try {
            log.info(`Pinning document for tenant: ${tenant}`, { documentId });

            const url = buildApiUrl(this.endpoints.pinnedDocuments.pin, { tenant });

            const response = await this.client.post<PinDocumentApiResponse>(url, {
                document_id: documentId,
            });

            if (!response.data) {
                log.warn('Empty response received from pin document API');
                return null;
            }

            log.info('Successfully pinned document', { documentId, data: response.data.data });
            return response.data.data;
        } catch (error) {
            log.error('Failed to pin document', { error });
            throw error;
        }
    }

    /**
     * Unpin a document for a tenant
     * @param tenant - Tenant identifier
     * @param pinnedDocumentId - Pinned document ID to unpin
     * @returns Promise that resolves when document is unpinned
     */
    public async unpinDocument(
        tenant: string,
        pinnedDocumentId: number
    ): Promise<void> {
        try {
            log.info(`Unpinning document for tenant: ${tenant}`, { pinnedDocumentId });

            const url = buildApiUrl(
                this.endpoints.pinnedDocuments.unpin,
                { tenant, id: pinnedDocumentId }
            );

            await this.client.delete<UnpinDocumentApiResponse>(url);

            log.info('Successfully unpinned document', { pinnedDocumentId });
        } catch (error) {
            log.error('Failed to unpin document', { error });
            throw error;
        }
    }

    /**
     * Fetch a single pinned document by id
     * @param tenant - Tenant identifier
     * @param pinnedDocumentId - Pinned document ID
     */
    public async fetchPinnedDocument(
        tenant: string,
        pinnedDocumentId: number
    ): Promise<PinnedDocumentData> {
        try {
            log.info(`Fetching pinned document for tenant: ${tenant}`, { pinnedDocumentId });

            const url = buildApiUrl(this.endpoints.pinnedDocuments.view, {
                tenant,
                id: pinnedDocumentId,
            });

            const response = await this.client.get<GetPinnedDocumentApiResponse>(url);

            log.info('Successfully fetched pinned document', { pinnedDocumentId });
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch pinned document', { error });
            throw error;
        }
    }

    /**
     * Reorder a pinned document
     * @param tenant - Tenant identifier
     * @param pinnedDocumentId - Pinned document ID to reorder
     * @param order - New order (min 0)
     */
    public async updatePinnedDocumentOrder(
        tenant: string,
        pinnedDocumentId: number,
        order: number
    ): Promise<PinnedDocumentData> {
        try {
            log.info(`Reordering pinned document for tenant: ${tenant}`, {
                pinnedDocumentId,
                order,
            });

            const url = buildApiUrl(this.endpoints.pinnedDocuments.order, {
                tenant,
                id: pinnedDocumentId,
            });

            const response = await this.client.put<UpdatePinnedDocumentOrderApiResponse>(url, {
                order,
            });

            log.info('Successfully reordered pinned document', { pinnedDocumentId, order });
            return response.data.data;
        } catch (error) {
            log.error('Failed to reorder pinned document', { error });
            throw error;
        }
    }
}

/**
 * Export singleton instance
 */
export const pinnedDocumentsApiService =
    PinnedDocumentsApiService.getInstance();
