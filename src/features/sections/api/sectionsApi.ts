/**
 * SectionsApiService — CRUD + bulk delete for /api/{tenant}/sections
 * (no trash / restore / force delete exist for sections).
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildSectionFormData, buildSectionParams } from '../utils/sectionPayload';
import type {
    ApiEnvelope,
    Section,
    SectionBulkResult,
    SectionFilters,
    SectionPayload,
    SectionsPaginatedData,
    SectionStats,
} from '../types/section.types';

const log = logger.createScoped('SectionsApiService');

/** Instance default is application/json, which would serialise FormData to JSON. */
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } } as const;

export class SectionsApiService {
    private static instance: SectionsApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.sections;

    private constructor() {
        log.info('SectionsApiService initialized');
    }

    public static getInstance(): SectionsApiService {
        if (!SectionsApiService.instance) {
            SectionsApiService.instance = new SectionsApiService();
        }
        return SectionsApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(
        tenant: string,
        filters: SectionFilters,
        signal?: AbortSignal,
    ): Promise<SectionsPaginatedData> {
        const res = await this.client.get<ApiEnvelope<SectionsPaginatedData>>(
            this.url(this.endpoints.list, tenant),
            { params: buildSectionParams(filters), signal },
        );
        return res.data.data;
    }

    public async fetchStats(tenant: string): Promise<SectionStats> {
        const res = await this.client.get<ApiEnvelope<SectionStats>>(this.url(this.endpoints.stats, tenant));
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number): Promise<Section> {
        const res = await this.client.get<ApiEnvelope<Section>>(this.url(this.endpoints.detail, tenant, id));
        return res.data.data;
    }

    public async create(tenant: string, p: SectionPayload): Promise<Section> {
        const url = this.url(this.endpoints.create, tenant);
        const res = p.image
            ? await this.client.post<ApiEnvelope<Section>>(url, buildSectionFormData(p), MULTIPART)
            : await this.client.post<ApiEnvelope<Section>>(url, {
                  name: p.name,
                  department_id: p.department_id,
                  description: p.description,
              });
        return res.data.data;
    }

    /** Multipart PUT isn't parsed by PHP: uploads go as POST + `_method=PUT`. */
    public async update(tenant: string, id: number, p: SectionPayload): Promise<Section> {
        const url = this.url(this.endpoints.update, tenant, id);
        const res = p.image
            ? await this.client.post<ApiEnvelope<Section>>(url, buildSectionFormData(p, 'PUT'), MULTIPART)
            : await this.client.put<ApiEnvelope<Section>>(url, {
                  name: p.name,
                  department_id: p.department_id,
                  description: p.description,
                  remove_image: p.removeImage,
              });
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async bulkDelete(tenant: string, ids: number[]): Promise<SectionBulkResult> {
        const res = await this.client.post<ApiEnvelope<SectionBulkResult>>(
            this.url(this.endpoints.bulk, tenant),
            { action: 'delete', ids },
        );
        return res.data.data;
    }
}

export const sectionsApiService = SectionsApiService.getInstance();
