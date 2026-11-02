/**
 * EntitiesApiService — full CRUD for /api/{tenant}/entities
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildEntityFormData, buildEntityJson, buildEntityParams } from '../utils/entityPayload';
import type {
    ApiEnvelope,
    DocumentEntity,
    EntityBulkAction,
    EntityBulkResult,
    EntityFilters,
    EntityPayload,
    EntityStats,
    EntitiesPaginatedData,
} from '../types/entity.types';

const log = logger.createScoped('EntitiesApiService');

/** Instance default is application/json, which would serialise FormData to JSON. */
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } } as const;

export class EntitiesApiService {
    private static instance: EntitiesApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.entities;

    private constructor() {
        log.info('EntitiesApiService initialized');
    }

    public static getInstance(): EntitiesApiService {
        if (!EntitiesApiService.instance) {
            EntitiesApiService.instance = new EntitiesApiService();
        }
        return EntitiesApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(
        tenant: string,
        filters: EntityFilters,
        signal?: AbortSignal,
    ): Promise<EntitiesPaginatedData> {
        const res = await this.client.get<ApiEnvelope<EntitiesPaginatedData>>(
            this.url(this.endpoints.list, tenant),
            { params: buildEntityParams(filters), signal },
        );
        return res.data.data;
    }

    public async fetchStats(tenant: string): Promise<EntityStats> {
        const res = await this.client.get<ApiEnvelope<EntityStats>>(
            this.url(this.endpoints.stats, tenant),
        );
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number): Promise<DocumentEntity> {
        const res = await this.client.get<ApiEnvelope<DocumentEntity>>(
            this.url(this.endpoints.detail, tenant, id),
        );
        return res.data.data;
    }

    public async create(tenant: string, p: EntityPayload): Promise<DocumentEntity> {
        const url = this.url(this.endpoints.create, tenant);
        const res = p.image
            ? await this.client.post<ApiEnvelope<DocumentEntity>>(url, buildEntityFormData(p), MULTIPART)
            : await this.client.post<ApiEnvelope<DocumentEntity>>(url, buildEntityJson(p));
        return res.data.data;
    }

    /** Multipart PUT isn't parsed by PHP: uploads go as POST + `_method=PUT`. */
    public async update(tenant: string, id: number, p: EntityPayload): Promise<DocumentEntity> {
        const url = this.url(this.endpoints.update, tenant, id);
        const res = p.image
            ? await this.client.post<ApiEnvelope<DocumentEntity>>(url, buildEntityFormData(p, 'PUT'), MULTIPART)
            : await this.client.put<ApiEnvelope<DocumentEntity>>(url, buildEntityJson(p));
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<DocumentEntity> {
        const res = await this.client.post<ApiEnvelope<DocumentEntity>>(
            this.url(this.endpoints.restore, tenant, id),
        );
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(
        tenant: string,
        action: EntityBulkAction,
        ids: number[],
    ): Promise<EntityBulkResult> {
        const res = await this.client.post<ApiEnvelope<EntityBulkResult>>(
            this.url(this.endpoints.bulk, tenant),
            { action, ids },
        );
        return res.data.data;
    }
}

export const entitiesApiService = EntitiesApiService.getInstance();
