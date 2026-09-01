/**
 * DocumentsListApiService — list/group/search/reminder endpoints
 * (single-document view lives in documentView.api.ts, download in
 * documentDownload-api.ts — this covers everything else under /documents)
 *
 * All listing/aggregation endpoints here are server-cached 20s per-user-
 * per-tenant — don't build client polling faster than that.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import {
    unwrapCategorizedResponse,
    type ApiDocument,
    type CategorizedApiResponse,
    type CategorizedFilters,
    type CategorizedGroup,
    type DocumentListParams,
    type DocumentListResponse,
    type DocumentSearchApiResponse,
    type DocumentSearchData,
    type DocumentSearchFilters,
    type DocumentsByDepartmentApiResponse,
    type DocumentsByDepartmentItem,
    type DocumentsByTypeApiResponse,
    type DocumentsByTypeItem,
    type DocumentsFlatListApiResponse,
    type PaginationMeta,
} from '../types/api.types';

const log = logger.createScoped('DocumentsListApiService');

export class DocumentsListApiService {
    private static instance: DocumentsListApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.documents;

    private constructor() {
        log.info('DocumentsListApiService initialized');
    }

    public static getInstance(): DocumentsListApiService {
        if (!DocumentsListApiService.instance) {
            DocumentsListApiService.instance = new DocumentsListApiService();
        }
        return DocumentsListApiService.instance;
    }

    /** GET /documents — paginated, all approved+visible docs. Only `page` is accepted. */
    public async fetchDocuments(
        tenant: string,
        params: DocumentListParams = {},
    ): Promise<{ documents: ApiDocument[]; meta: PaginationMeta }> {
        try {
            const url = buildApiUrl(this.endpoints.list, { tenant });
            const response = await this.client.get<DocumentListResponse>(url, {
                params: { page: params.page ?? 1 },
            });

            return {
                documents: response.data.data.data ?? [],
                meta: response.data.data.meta,
            };
        } catch (error) {
            log.error('Failed to fetch documents', { error });
            throw error;
        }
    }

    /** GET /documents/documents-by-types — every type with ≥1 doc, split one_time/renewal. */
    public async fetchDocumentsByTypes(tenant: string): Promise<DocumentsByTypeItem[]> {
        try {
            const url = buildApiUrl(this.endpoints.byTypes, { tenant });
            const response = await this.client.get<DocumentsByTypeApiResponse>(url);
            return response.data.data ?? [];
        } catch (error) {
            log.error('Failed to fetch documents by types', { error });
            throw error;
        }
    }

    /** GET /documents/documents-by-departments — same shape, grouped by department. */
    public async fetchDocumentsByDepartments(tenant: string): Promise<DocumentsByDepartmentItem[]> {
        try {
            const url = buildApiUrl(this.endpoints.byDepartments, { tenant });
            const response = await this.client.get<DocumentsByDepartmentApiResponse>(url);
            return response.data.data ?? [];
        } catch (error) {
            log.error('Failed to fetch documents by departments', { error });
            throw error;
        }
    }

    /**
     * POST /documents/categorized — grouped-by-type, with optional title/
     * entity/department/expiry filters (unlike /search, entity+department
     * here filter server-side unconditionally).
     */
    public async fetchCategorized(
        tenant: string,
        filters: CategorizedFilters = {},
    ): Promise<CategorizedGroup[]> {
        try {
            const url = buildApiUrl(this.endpoints.categorized, { tenant });
            const response = await this.client.post<CategorizedApiResponse>(url, filters);
            return unwrapCategorizedResponse(response.data);
        } catch (error) {
            log.error('Failed to fetch categorized documents', { error });
            throw error;
        }
    }

    /** POST /documents/search — filtered search; `projects` only populates when `title` is sent. */
    public async searchDocuments(
        tenant: string,
        filters: DocumentSearchFilters = {},
    ): Promise<DocumentSearchData> {
        try {
            const url = buildApiUrl(this.endpoints.search, { tenant });
            const response = await this.client.post<DocumentSearchApiResponse>(url, filters);
            return response.data.data ?? { documents: [], projects: [] };
        } catch (error) {
            log.error('Failed to search documents', { error });
            throw error;
        }
    }

    /** GET /documents/reminder — docs with a reminder configured (not necessarily firing). */
    public async fetchReminders(tenant: string): Promise<ApiDocument[]> {
        try {
            const url = buildApiUrl(this.endpoints.reminder, { tenant });
            const response = await this.client.get<DocumentsFlatListApiResponse>(url);
            return response.data.data ?? [];
        } catch (error) {
            log.error('Failed to fetch reminders', { error });
            throw error;
        }
    }

    /** GET /documents/active-reminders — reminder window currently active, or overdue. */
    public async fetchActiveReminders(tenant: string): Promise<ApiDocument[]> {
        try {
            const url = buildApiUrl(this.endpoints.activeReminders, { tenant });
            const response = await this.client.get<DocumentsFlatListApiResponse>(url);
            return response.data.data ?? [];
        } catch (error) {
            log.error('Failed to fetch active reminders', { error });
            throw error;
        }
    }
}

export const documentsListApiService = DocumentsListApiService.getInstance();
