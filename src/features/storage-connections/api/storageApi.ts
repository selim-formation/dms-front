/**
 * StorageApiService — /api/{tenant}/storage-connections
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildStorageParams } from '../utils/storagePayload';
import type {
    ApiEnvelope,
    CreateStorageConnection,
    ReplaceCredentialsPayload,
    StorageConnection,
    StorageFilters,
    StoragePaginatedData,
    TestResult,
    UpdateStoragePayload,
} from '../types/storage.types';

const log = logger.createScoped('StorageApiService');

export class StorageApiService {
    private static instance: StorageApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.storageConnections;

    private constructor() {
        log.info('StorageApiService initialized');
    }

    public static getInstance(): StorageApiService {
        if (!StorageApiService.instance) {
            StorageApiService.instance = new StorageApiService();
        }
        return StorageApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(tenant: string, filters: StorageFilters, signal?: AbortSignal): Promise<StoragePaginatedData> {
        const res = await this.client.get<ApiEnvelope<StoragePaginatedData>>(this.url(this.endpoints.list, tenant), {
            params: buildStorageParams(filters),
            signal,
        });
        return res.data.data;
    }

    public async create(tenant: string, payload: CreateStorageConnection): Promise<StorageConnection> {
        const res = await this.client.post<ApiEnvelope<StorageConnection>>(this.url(this.endpoints.create, tenant), payload);
        return res.data.data;
    }

    public async update(tenant: string, id: number, payload: UpdateStoragePayload): Promise<StorageConnection> {
        const res = await this.client.put<ApiEnvelope<StorageConnection>>(this.url(this.endpoints.update, tenant, id), payload);
        return res.data.data;
    }

    public async replaceCredentials(tenant: string, id: number, payload: ReplaceCredentialsPayload): Promise<StorageConnection> {
        const res = await this.client.put<ApiEnvelope<StorageConnection>>(this.url(this.endpoints.credentials, tenant, id), payload);
        return res.data.data;
    }

    /** 200 whether it passed or not: read `passed`. */
    public async test(tenant: string, id: number): Promise<TestResult> {
        const res = await this.client.post<ApiEnvelope<TestResult>>(this.url(this.endpoints.test, tenant, id));
        return res.data.data;
    }

    public async setDefault(tenant: string, id: number): Promise<StorageConnection> {
        const res = await this.client.post<ApiEnvelope<StorageConnection>>(this.url(this.endpoints.default, tenant, id));
        return res.data.data;
    }

    public async disable(tenant: string, id: number): Promise<StorageConnection> {
        const res = await this.client.post<ApiEnvelope<StorageConnection>>(this.url(this.endpoints.disable, tenant, id));
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }
}

export const storageApiService = StorageApiService.getInstance();
