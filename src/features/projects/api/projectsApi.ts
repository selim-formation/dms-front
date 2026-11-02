/**
 * ProjectsApiService — full CRUD for /api/{tenant}/projects
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildProjectFormData, buildProjectParams } from '../utils/projectPayload';
import type {
    ApiEnvelope,
    Project,
    ProjectBulkAction,
    ProjectBulkResult,
    ProjectFilters,
    ProjectPayload,
    ProjectsPaginatedData,
} from '../types/project.types';

const log = logger.createScoped('ProjectsApiService');

/** Instance default is application/json, which would serialise FormData to JSON. */
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } } as const;

export class ProjectsApiService {
    private static instance: ProjectsApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.projects;

    private constructor() {
        log.info('ProjectsApiService initialized');
    }

    public static getInstance(): ProjectsApiService {
        if (!ProjectsApiService.instance) {
            ProjectsApiService.instance = new ProjectsApiService();
        }
        return ProjectsApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(
        tenant: string,
        filters: ProjectFilters,
        signal?: AbortSignal,
    ): Promise<ProjectsPaginatedData> {
        const res = await this.client.get<ApiEnvelope<ProjectsPaginatedData>>(
            this.url(this.endpoints.list, tenant),
            { params: buildProjectParams(filters), signal },
        );
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number): Promise<Project> {
        const res = await this.client.get<ApiEnvelope<Project>>(this.url(this.endpoints.detail, tenant, id));
        return res.data.data;
    }

    /** Always multipart: the file is required on create. */
    public async create(tenant: string, p: ProjectPayload): Promise<Project> {
        const res = await this.client.post<ApiEnvelope<Project>>(
            this.url(this.endpoints.create, tenant),
            buildProjectFormData(p),
            MULTIPART,
        );
        return res.data.data;
    }

    /** JSON PUT normally (`null` clears a field); a new file goes as POST + `_method=PUT`. */
    public async update(tenant: string, id: number, p: ProjectPayload): Promise<Project> {
        const url = this.url(this.endpoints.update, tenant, id);
        const res = p.project_file
            ? await this.client.post<ApiEnvelope<Project>>(url, buildProjectFormData(p, 'PUT'), MULTIPART)
            : await this.client.put<ApiEnvelope<Project>>(url, p);
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<Project> {
        const res = await this.client.post<ApiEnvelope<Project>>(this.url(this.endpoints.restore, tenant, id));
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(tenant: string, action: ProjectBulkAction, ids: number[]): Promise<ProjectBulkResult> {
        const res = await this.client.post<ApiEnvelope<ProjectBulkResult>>(
            this.url(this.endpoints.bulk, tenant),
            { action, ids },
        );
        return res.data.data;
    }
}

export const projectsApiService = ProjectsApiService.getInstance();
