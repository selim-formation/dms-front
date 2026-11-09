/**
 * UserManagementApiService — list / show / create / edit / activate / deactivate /
 * delete / restore / force delete / bulk for /api/{tenant}/user-management.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { buildUserParams } from '../utils/userPayload';
import type {
    ApiEnvelope,
    ManagedUser,
    UserBulkAction,
    UserBulkResult,
    UserFilters,
    UserPayload,
    UsersPaginatedData,
} from '../types/user.types';

export class UserManagementApiService {
    private static instance: UserManagementApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.userManagement;

    private constructor() {}

    public static getInstance(): UserManagementApiService {
        if (!UserManagementApiService.instance) {
            UserManagementApiService.instance = new UserManagementApiService();
        }
        return UserManagementApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(tenant: string, filters: UserFilters, signal?: AbortSignal): Promise<UsersPaginatedData> {
        const res = await this.client.get<ApiEnvelope<UsersPaginatedData>>(this.url(this.endpoints.list, tenant), {
            params: buildUserParams(filters),
            signal,
        });
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number, signal?: AbortSignal): Promise<ManagedUser> {
        const res = await this.client.get<ApiEnvelope<ManagedUser>>(this.url(this.endpoints.detail, tenant, id), { signal });
        return res.data.data;
    }

    public async create(tenant: string, payload: UserPayload): Promise<ManagedUser> {
        const res = await this.client.post<ApiEnvelope<ManagedUser>>(this.url(this.endpoints.create, tenant), payload);
        return res.data.data;
    }

    public async update(tenant: string, id: number, payload: UserPayload): Promise<ManagedUser> {
        const res = await this.client.put<ApiEnvelope<ManagedUser>>(this.url(this.endpoints.update, tenant, id), payload);
        return res.data.data;
    }

    public async activate(tenant: string, id: number): Promise<ManagedUser> {
        const res = await this.client.post<ApiEnvelope<ManagedUser>>(this.url(this.endpoints.activate, tenant, id));
        return res.data.data;
    }

    public async deactivate(tenant: string, id: number): Promise<ManagedUser> {
        const res = await this.client.post<ApiEnvelope<ManagedUser>>(this.url(this.endpoints.deactivate, tenant, id));
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<ManagedUser> {
        const res = await this.client.post<ApiEnvelope<ManagedUser>>(this.url(this.endpoints.restore, tenant, id));
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(tenant: string, action: UserBulkAction, ids: number[]): Promise<UserBulkResult> {
        const res = await this.client.post<ApiEnvelope<UserBulkResult>>(this.url(this.endpoints.bulk, tenant), { action, ids });
        return res.data.data;
    }
}

export const userApiService = UserManagementApiService.getInstance();
