/**
 * DepartmentsApiService — full CRUD for /api/{tenant}/departments
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildDepartmentFormData, buildDepartmentParams } from '../utils/departmentPayload';
import type {
    ApiEnvelope,
    Department,
    DepartmentBulkAction,
    DepartmentBulkResult,
    DepartmentFilters,
    DepartmentPayload,
    DepartmentsPaginatedData,
    DepartmentStats,
} from '../types/department.types';

const log = logger.createScoped('DepartmentsApiService');

/** Instance default is application/json, which would serialise FormData to JSON. */
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } } as const;

export class DepartmentsApiService {
    private static instance: DepartmentsApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.departments;

    private constructor() {
        log.info('DepartmentsApiService initialized');
    }

    public static getInstance(): DepartmentsApiService {
        if (!DepartmentsApiService.instance) {
            DepartmentsApiService.instance = new DepartmentsApiService();
        }
        return DepartmentsApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(
        tenant: string,
        filters: DepartmentFilters,
        signal?: AbortSignal,
    ): Promise<DepartmentsPaginatedData> {
        const res = await this.client.get<ApiEnvelope<DepartmentsPaginatedData>>(
            this.url(this.endpoints.list, tenant),
            { params: buildDepartmentParams(filters), signal },
        );
        return res.data.data;
    }

    public async fetchStats(tenant: string): Promise<DepartmentStats> {
        const res = await this.client.get<ApiEnvelope<DepartmentStats>>(
            this.url(this.endpoints.stats, tenant),
        );
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number): Promise<Department> {
        const res = await this.client.get<ApiEnvelope<Department>>(
            this.url(this.endpoints.detail, tenant, id),
        );
        return res.data.data;
    }

    public async create(tenant: string, p: DepartmentPayload): Promise<Department> {
        const url = this.url(this.endpoints.create, tenant);
        const res = p.image
            ? await this.client.post<ApiEnvelope<Department>>(url, buildDepartmentFormData(p), MULTIPART)
            : await this.client.post<ApiEnvelope<Department>>(url, { title: p.title, sections: p.sections });
        return res.data.data;
    }

    /**
     * Partial update. Multipart PUT is not parsed by PHP, so uploads go as
     * POST + `_method=PUT`. FormData can't carry an empty `sections` array,
     * so clearing sections alongside an upload takes a follow-up JSON PUT.
     */
    public async update(tenant: string, id: number, p: DepartmentPayload): Promise<Department> {
        const url = this.url(this.endpoints.update, tenant, id);

        if (p.image) {
            const clearSections = Array.isArray(p.sections) && p.sections.length === 0;
            const res = await this.client.post<ApiEnvelope<Department>>(
                url,
                buildDepartmentFormData(p, 'PUT'),
                MULTIPART,
            );
            if (!clearSections) return res.data.data;

            const second = await this.client.put<ApiEnvelope<Department>>(url, { sections: [] });
            return second.data.data;
        }

        const res = await this.client.put<ApiEnvelope<Department>>(url, {
            title: p.title,
            remove_image: p.removeImage,
            sections: p.sections,
        });
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<Department> {
        const res = await this.client.post<ApiEnvelope<Department>>(
            this.url(this.endpoints.restore, tenant, id),
        );
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(
        tenant: string,
        action: DepartmentBulkAction,
        ids: number[],
    ): Promise<DepartmentBulkResult> {
        const res = await this.client.post<ApiEnvelope<DepartmentBulkResult>>(
            this.url(this.endpoints.bulk, tenant),
            { action, ids },
        );
        return res.data.data;
    }
}

export const departmentsApiService = DepartmentsApiService.getInstance();
