/**
 * CompanyManagementApiService — list / show / create / edit / delete / restore /
 * force delete / bulk for /api/tenant-management (no tenant in the URL).
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { buildCompanyParams } from '../utils/companyPayload';
import type {
    ApiEnvelope,
    CompaniesPaginatedData,
    Company,
    CompanyBulkAction,
    CompanyBulkResult,
    CompanyFilters,
    CompanyPayload,
} from '../types/company.types';

export class CompanyManagementApiService {
    private static instance: CompanyManagementApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.tenantManagement;

    private constructor() {}

    public static getInstance(): CompanyManagementApiService {
        if (!CompanyManagementApiService.instance) {
            CompanyManagementApiService.instance = new CompanyManagementApiService();
        }
        return CompanyManagementApiService.instance;
    }

    private url(endpoint: string, id?: string): string {
        return buildApiUrl(endpoint, id === undefined ? {} : { id: encodeURIComponent(id) });
    }

    public async fetchList(filters: CompanyFilters, signal?: AbortSignal): Promise<CompaniesPaginatedData> {
        const res = await this.client.get<ApiEnvelope<CompaniesPaginatedData>>(this.url(this.endpoints.list), {
            params: buildCompanyParams(filters),
            signal,
        });
        return res.data.data;
    }

    public async fetchOne(id: string, signal?: AbortSignal): Promise<Company> {
        const res = await this.client.get<ApiEnvelope<Company>>(this.url(this.endpoints.detail, id), { signal });
        return res.data.data;
    }

    public async create(payload: CompanyPayload): Promise<Company> {
        const res = await this.client.post<ApiEnvelope<Company>>(this.url(this.endpoints.create), payload);
        return res.data.data;
    }

    public async update(id: string, payload: CompanyPayload): Promise<Company> {
        const res = await this.client.put<ApiEnvelope<Company>>(this.url(this.endpoints.update, id), payload);
        return res.data.data;
    }

    public async remove(id: string): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, id));
    }

    public async restore(id: string): Promise<Company> {
        const res = await this.client.post<ApiEnvelope<Company>>(this.url(this.endpoints.restore, id));
        return res.data.data;
    }

    public async forceDelete(id: string): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, id));
    }

    public async bulk(action: CompanyBulkAction, ids: string[]): Promise<CompanyBulkResult> {
        const res = await this.client.post<ApiEnvelope<CompanyBulkResult>>(this.url(this.endpoints.bulk), { action, ids });
        return res.data.data;
    }
}

export const companyApiService = CompanyManagementApiService.getInstance();
