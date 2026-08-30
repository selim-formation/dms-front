/**
 * DocumentSharesApiService - API Service for Document Shares
 * Handles all HTTP requests related to sharing documents across departments/sections
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type {
    CreateDocumentShareApiResponse,
    CreateDocumentSharePayload,
    DocumentShareData,
    DocumentSharesListParams,
    DocumentSharesPaginatedData,
    GetDocumentShareApiResponse,
    GetDocumentSharesApiResponse,
    RevokeDocumentShareApiResponse,
    UpdateDocumentShareApiResponse,
    UpdateDocumentSharePayload,
} from '../types/documentShare.types';

const log = logger.createScoped('DocumentSharesApiService');

const EMPTY_PAGE = (params: DocumentSharesListParams): DocumentSharesPaginatedData => ({
    data: [],
    links: { first: null, last: null, prev: null, next: null },
    meta: { current_page: 1, last_page: 1, per_page: params.per_page ?? 10, total: 0 },
});

/**
 * DocumentSharesApiService class - Singleton pattern
 * Encapsulates all document-share related API operations
 */
export class DocumentSharesApiService {
    private static instance: DocumentSharesApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints;

    private constructor() {
        log.info('DocumentSharesApiService initialized');
    }

    public static getInstance(): DocumentSharesApiService {
        if (!DocumentSharesApiService.instance) {
            DocumentSharesApiService.instance = new DocumentSharesApiService();
        }
        return DocumentSharesApiService.instance;
    }

    /** Shares I've given (documents I shared with others) */
    public async fetchGiven(
        tenant: string,
        params: DocumentSharesListParams = {}
    ): Promise<DocumentSharesPaginatedData> {
        try {
            log.info(`Fetching given shares for tenant: ${tenant}`, { params });
            const url = buildApiUrl(this.endpoints.documentShares.given, { tenant });
            const response = await this.client.get<GetDocumentSharesApiResponse>(url, { params });

            if (!response.data?.data) {
                log.warn('Empty response received from document-shares/given API');
                return EMPTY_PAGE(params);
            }

            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch given shares', { error });
            throw error;
        }
    }

    /** Shares given to me (documents shared with me by others) */
    public async fetchReceived(
        tenant: string,
        params: DocumentSharesListParams = {}
    ): Promise<DocumentSharesPaginatedData> {
        try {
            log.info(`Fetching received shares for tenant: ${tenant}`, { params });
            const url = buildApiUrl(this.endpoints.documentShares.received, { tenant });
            const response = await this.client.get<GetDocumentSharesApiResponse>(url, { params });

            if (!response.data?.data) {
                log.warn('Empty response received from document-shares/received API');
                return EMPTY_PAGE(params);
            }

            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch received shares', { error });
            throw error;
        }
    }

    public async fetchOne(tenant: string, shareId: number): Promise<DocumentShareData> {
        try {
            log.info(`Fetching share for tenant: ${tenant}`, { shareId });
            const url = buildApiUrl(this.endpoints.documentShares.view, { tenant, id: shareId });
            const response = await this.client.get<GetDocumentShareApiResponse>(url);
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch share', { error });
            throw error;
        }
    }

    /** Grant access. Re-POSTing the same document_id + shared_with pair updates/reactivates the existing share. */
    public async create(
        tenant: string,
        payload: CreateDocumentSharePayload
    ): Promise<DocumentShareData> {
        try {
            log.info(`Creating share for tenant: ${tenant}`, { payload });
            const url = buildApiUrl(this.endpoints.documentShares.create, { tenant });
            const response = await this.client.post<CreateDocumentShareApiResponse>(url, payload);
            log.info('Successfully created share', { data: response.data.data });
            return response.data.data;
        } catch (error) {
            log.error('Failed to create share', { error });
            throw error;
        }
    }

    /** Only the granter (shared_by) can update. Partial patch. */
    public async update(
        tenant: string,
        shareId: number,
        payload: UpdateDocumentSharePayload
    ): Promise<DocumentShareData> {
        try {
            log.info(`Updating share for tenant: ${tenant}`, { shareId, payload });
            const url = buildApiUrl(this.endpoints.documentShares.update, { tenant, id: shareId });
            const response = await this.client.put<UpdateDocumentShareApiResponse>(url, payload);
            return response.data.data;
        } catch (error) {
            log.error('Failed to update share', { error });
            throw error;
        }
    }

    /** Soft-revoke (sets revoked_at). Only the granter can revoke. */
    public async revoke(tenant: string, shareId: number): Promise<void> {
        try {
            log.info(`Revoking share for tenant: ${tenant}`, { shareId });
            const url = buildApiUrl(this.endpoints.documentShares.delete, { tenant, id: shareId });
            await this.client.delete<RevokeDocumentShareApiResponse>(url);
        } catch (error) {
            log.error('Failed to revoke share', { error });
            throw error;
        }
    }
}

export const documentSharesApiService = DocumentSharesApiService.getInstance();
