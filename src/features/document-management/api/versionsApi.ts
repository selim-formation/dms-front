/**
 * VersionsApiService — versions of one managed document:
 * /api/{tenant}/document-management/{id}/versions
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type { ApiEnvelope } from '../types/management.types';
import type {
    AddVersionPayload,
    DocumentVersion,
    PreviewLink,
    UpdateVersionPayload,
    VersionBulkResult,
} from '../types/version.types';

const log = logger.createScoped('VersionsApiService');

export class VersionsApiService {
    private static instance: VersionsApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.documentVersions;

    private constructor() {
        log.info('VersionsApiService initialized');
    }

    public static getInstance(): VersionsApiService {
        if (!VersionsApiService.instance) {
            VersionsApiService.instance = new VersionsApiService();
        }
        return VersionsApiService.instance;
    }

    private url(endpoint: string, tenant: string, id: number, versionId?: number): string {
        return buildApiUrl(endpoint, versionId === undefined ? { tenant, id } : { tenant, id, versionId });
    }

    /** Live versions, newest first. Accepts a plain array or a paginated wrapper. */
    public async fetchList(tenant: string, documentId: number, signal?: AbortSignal): Promise<DocumentVersion[]> {
        const res = await this.client.get<ApiEnvelope<DocumentVersion[] | { data: DocumentVersion[] }>>(
            this.url(this.endpoints.list, tenant, documentId),
            { signal },
        );
        const body = res.data.data;
        return Array.isArray(body) ? body : (body?.data ?? []);
    }

    public async add(tenant: string, documentId: number, payload: AddVersionPayload): Promise<DocumentVersion> {
        const res = await this.client.post<ApiEnvelope<DocumentVersion>>(this.url(this.endpoints.create, tenant, documentId), payload);
        return res.data.data;
    }

    /** Replaces the metadata; with `upload_id` the file is replaced too. */
    public async update(tenant: string, documentId: number, versionId: number, payload: UpdateVersionPayload): Promise<DocumentVersion> {
        const res = await this.client.put<ApiEnvelope<DocumentVersion>>(
            this.url(this.endpoints.update, tenant, documentId, versionId),
            payload,
        );
        return res.data.data;
    }

    public async remove(tenant: string, documentId: number, versionId: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, documentId, versionId));
    }

    public async bulkRemove(tenant: string, documentId: number, ids: number[]): Promise<VersionBulkResult> {
        const res = await this.client.post<ApiEnvelope<VersionBulkResult>>(this.url(this.endpoints.bulk, tenant, documentId), {
            action: 'delete',
            ids,
        });
        return res.data.data;
    }

    /** 5-minute link to the stored file. */
    public async preview(tenant: string, documentId: number, versionId: number): Promise<PreviewLink> {
        const res = await this.client.get<ApiEnvelope<PreviewLink>>(this.url(this.endpoints.preview, tenant, documentId, versionId));
        return res.data.data;
    }
}

export const versionsApiService = VersionsApiService.getInstance();
