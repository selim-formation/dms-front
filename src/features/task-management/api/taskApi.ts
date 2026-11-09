/**
 * TaskManagementApiService — list / counts / show / create / edit / status /
 * delete / restore / force delete / bulk for /api/{tenant}/task-management.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { buildTaskParams } from '../utils/taskPayload';
import type {
    ApiEnvelope,
    Task,
    TaskBulkAction,
    TaskBulkResult,
    TaskCounts,
    TaskFilters,
    TaskPaginatedData,
    TaskPayload,
    TaskStatus,
} from '../types/task.types';

export class TaskManagementApiService {
    private static instance: TaskManagementApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.taskManagement;

    private constructor() {}

    public static getInstance(): TaskManagementApiService {
        if (!TaskManagementApiService.instance) {
            TaskManagementApiService.instance = new TaskManagementApiService();
        }
        return TaskManagementApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(tenant: string, filters: TaskFilters, signal?: AbortSignal): Promise<TaskPaginatedData> {
        const res = await this.client.get<ApiEnvelope<TaskPaginatedData>>(this.url(this.endpoints.list, tenant), {
            params: buildTaskParams(filters),
            signal,
        });
        return res.data.data;
    }

    public async fetchCounts(tenant: string, signal?: AbortSignal): Promise<TaskCounts> {
        const res = await this.client.get<ApiEnvelope<TaskCounts>>(this.url(this.endpoints.counts, tenant), { signal });
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number, signal?: AbortSignal): Promise<Task> {
        const res = await this.client.get<ApiEnvelope<Task>>(this.url(this.endpoints.detail, tenant, id), { signal });
        return res.data.data;
    }

    public async create(tenant: string, payload: TaskPayload): Promise<Task> {
        const res = await this.client.post<ApiEnvelope<Task>>(this.url(this.endpoints.create, tenant), payload);
        return res.data.data;
    }

    public async update(tenant: string, id: number, payload: TaskPayload): Promise<Task> {
        const res = await this.client.put<ApiEnvelope<Task>>(this.url(this.endpoints.update, tenant, id), payload);
        return res.data.data;
    }

    public async changeStatus(tenant: string, id: number, status: TaskStatus): Promise<Task> {
        const res = await this.client.post<ApiEnvelope<Task>>(this.url(this.endpoints.status, tenant, id), { status });
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<Task> {
        const res = await this.client.post<ApiEnvelope<Task>>(this.url(this.endpoints.restore, tenant, id));
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(tenant: string, action: TaskBulkAction, ids: number[]): Promise<TaskBulkResult> {
        const res = await this.client.post<ApiEnvelope<TaskBulkResult>>(this.url(this.endpoints.bulk, tenant), { action, ids });
        return res.data.data;
    }
}

export const taskApiService = TaskManagementApiService.getInstance();
