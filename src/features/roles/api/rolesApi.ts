/**
 * RolesApiService — CRUD + bulk delete for /api/{tenant}/roles
 * (roles have no trash, restore or stats endpoints).
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildRoleParams } from '../utils/rolePayload';
import type {
    ApiEnvelope,
    Role,
    RoleBulkResult,
    RoleFilters,
    RolePayload,
    RolesPaginatedData,
} from '../types/role.types';

const log = logger.createScoped('RolesApiService');

export class RolesApiService {
    private static instance: RolesApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.roles;

    private constructor() {
        log.info('RolesApiService initialized');
    }

    public static getInstance(): RolesApiService {
        if (!RolesApiService.instance) {
            RolesApiService.instance = new RolesApiService();
        }
        return RolesApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(
        tenant: string,
        filters: RoleFilters,
        signal?: AbortSignal,
    ): Promise<RolesPaginatedData> {
        const res = await this.client.get<ApiEnvelope<RolesPaginatedData>>(
            this.url(this.endpoints.list, tenant),
            { params: buildRoleParams(filters), signal },
        );
        return res.data.data;
    }

    /** Includes `permissions`. */
    public async fetchOne(tenant: string, id: number): Promise<Role> {
        const res = await this.client.get<ApiEnvelope<Role>>(this.url(this.endpoints.detail, tenant, id));
        return res.data.data;
    }

    public async create(tenant: string, p: RolePayload): Promise<Role> {
        const res = await this.client.post<ApiEnvelope<Role>>(this.url(this.endpoints.create, tenant), p);
        return res.data.data;
    }

    /** Partial update: only the keys present are changed. */
    public async update(tenant: string, id: number, p: RolePayload): Promise<Role> {
        const res = await this.client.put<ApiEnvelope<Role>>(this.url(this.endpoints.update, tenant, id), p);
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async bulkDelete(tenant: string, ids: number[]): Promise<RoleBulkResult> {
        const res = await this.client.post<ApiEnvelope<RoleBulkResult>>(
            this.url(this.endpoints.bulk, tenant),
            { action: 'delete', ids },
        );
        return res.data.data;
    }
}

export const rolesApiService = RolesApiService.getInstance();
