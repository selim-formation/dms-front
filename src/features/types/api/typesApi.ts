/**
 * TypesApiService — full CRUD for /api/{tenant}/types
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildTypeFormData, buildTypeJson, buildTypeParams } from '../utils/typePayload';
import type {
    ApiEnvelope,
    DocumentType,
    TypeBulkAction,
    TypeBulkResult,
    TypeFilters,
    TypePayload,
    TypesPaginatedData,
} from '../types/type.types';

const log = logger.createScoped('TypesApiService');

/** Instance default is application/json, which would serialise FormData to JSON. */
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } } as const;

export class TypesApiService {
    private static instance: TypesApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.types;

    private constructor() {
        log.info('TypesApiService initialized');
    }

    public static getInstance(): TypesApiService {
        if (!TypesApiService.instance) {
            TypesApiService.instance = new TypesApiService();
        }
        return TypesApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(
        tenant: string,
        filters: TypeFilters,
        signal?: AbortSignal,
    ): Promise<TypesPaginatedData> {
        const res = await this.client.get<ApiEnvelope<TypesPaginatedData>>(
            this.url(this.endpoints.list, tenant),
            { params: buildTypeParams(filters), signal },
        );
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number): Promise<DocumentType> {
        const res = await this.client.get<ApiEnvelope<DocumentType>>(
            this.url(this.endpoints.detail, tenant, id),
        );
        return res.data.data;
    }

    public async create(tenant: string, p: TypePayload): Promise<DocumentType> {
        const url = this.url(this.endpoints.create, tenant);
        const res = p.image
            ? await this.client.post<ApiEnvelope<DocumentType>>(url, buildTypeFormData(p), MULTIPART)
            : await this.client.post<ApiEnvelope<DocumentType>>(url, buildTypeJson(p));
        return res.data.data;
    }

    /** Multipart PUT isn't parsed by PHP: uploads go as POST + `_method=PUT`. */
    public async update(tenant: string, id: number, p: TypePayload): Promise<DocumentType> {
        const url = this.url(this.endpoints.update, tenant, id);
        const res = p.image
            ? await this.client.post<ApiEnvelope<DocumentType>>(url, buildTypeFormData(p, 'PUT'), MULTIPART)
            : await this.client.put<ApiEnvelope<DocumentType>>(url, buildTypeJson(p));
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<DocumentType> {
        const res = await this.client.post<ApiEnvelope<DocumentType>>(
            this.url(this.endpoints.restore, tenant, id),
        );
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(
        tenant: string,
        action: TypeBulkAction,
        ids: number[],
    ): Promise<TypeBulkResult> {
        const res = await this.client.post<ApiEnvelope<TypeBulkResult>>(
            this.url(this.endpoints.bulk, tenant),
            { action, ids },
        );
        return res.data.data;
    }
}

export const typesApiService = TypesApiService.getInstance();
