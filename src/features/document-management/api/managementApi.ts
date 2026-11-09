/**
 * ManagementApiService — list / counts / show / review / delete / restore /
 * force delete / bulk for /api/{tenant}/document-management.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildManagementParams } from '../utils/managementPayload';
import type {
    ApiEnvelope,
    BulkAction,
    BulkResult,
    CreateDocumentPayload,
    DocumentPayload,
    DocumentCounts,
    ManagedDocument,
    ManagedDocumentDetail,
    ManagementFilters,
    ManagementPaginatedData,
    ReviewDecision,
} from '../types/management.types';

const log = logger.createScoped('ManagementApiService');

export class ManagementApiService {
    private static instance: ManagementApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.documentManagement;

    private constructor() {
        log.info('ManagementApiService initialized');
    }

    public static getInstance(): ManagementApiService {
        if (!ManagementApiService.instance) {
            ManagementApiService.instance = new ManagementApiService();
        }
        return ManagementApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(tenant: string, filters: ManagementFilters, signal?: AbortSignal): Promise<ManagementPaginatedData> {
        const res = await this.client.get<ApiEnvelope<ManagementPaginatedData>>(this.url(this.endpoints.list, tenant), {
            params: buildManagementParams(filters),
            signal,
        });
        return res.data.data;
    }

    public async fetchCounts(tenant: string, signal?: AbortSignal): Promise<DocumentCounts> {
        const res = await this.client.get<ApiEnvelope<DocumentCounts>>(this.url(this.endpoints.counts, tenant), { signal });
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number, signal?: AbortSignal): Promise<ManagedDocumentDetail> {
        const res = await this.client.get<ApiEnvelope<ManagedDocumentDetail>>(this.url(this.endpoints.detail, tenant, id), { signal });
        return res.data.data;
    }

    public async create(tenant: string, payload: CreateDocumentPayload): Promise<ManagedDocumentDetail> {
        const res = await this.client.post<ApiEnvelope<ManagedDocumentDetail>>(this.url(this.endpoints.create, tenant), payload);
        return res.data.data;
    }

    /** `versions` are ignored by the server on edit (phase 3). */
    public async update(tenant: string, id: number, payload: DocumentPayload): Promise<ManagedDocumentDetail> {
        const res = await this.client.put<ApiEnvelope<ManagedDocumentDetail>>(this.url(this.endpoints.update, tenant, id), payload);
        return res.data.data;
    }

    public async review(tenant: string, id: number, decision: ReviewDecision, note?: string): Promise<ManagedDocumentDetail> {
        const res = await this.client.post<ApiEnvelope<ManagedDocumentDetail>>(
            this.url(this.endpoints[decision], tenant, id),
            note ? { note } : {},
        );
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<ManagedDocument> {
        const res = await this.client.post<ApiEnvelope<ManagedDocument>>(this.url(this.endpoints.restore, tenant, id));
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(tenant: string, action: BulkAction, ids: number[]): Promise<BulkResult> {
        const res = await this.client.post<ApiEnvelope<BulkResult>>(this.url(this.endpoints.bulk, tenant), { action, ids });
        return res.data.data;
    }
}

export const managementApiService = ManagementApiService.getInstance();
