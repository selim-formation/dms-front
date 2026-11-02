/**
 * EmployeesApiService — full CRUD for /api/{tenant}/employees (JSON only).
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildEmployeeParams } from '../utils/employeePayload';
import type {
    ApiEnvelope,
    Employee,
    EmployeeBulkAction,
    EmployeeBulkResult,
    EmployeeFilters,
    EmployeePayload,
    EmployeesPaginatedData,
} from '../types/employee.types';

const log = logger.createScoped('EmployeesApiService');

export class EmployeesApiService {
    private static instance: EmployeesApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.employees;

    private constructor() {
        log.info('EmployeesApiService initialized');
    }

    public static getInstance(): EmployeesApiService {
        if (!EmployeesApiService.instance) {
            EmployeesApiService.instance = new EmployeesApiService();
        }
        return EmployeesApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(
        tenant: string,
        filters: EmployeeFilters,
        signal?: AbortSignal,
    ): Promise<EmployeesPaginatedData> {
        const res = await this.client.get<ApiEnvelope<EmployeesPaginatedData>>(
            this.url(this.endpoints.list, tenant),
            { params: buildEmployeeParams(filters), signal },
        );
        return res.data.data;
    }

    public async create(tenant: string, p: Required<EmployeePayload>): Promise<Employee> {
        const res = await this.client.post<ApiEnvelope<Employee>>(this.url(this.endpoints.create, tenant), p);
        return res.data.data;
    }

    /** Partial update: send only what changed. */
    public async update(tenant: string, id: number, p: EmployeePayload): Promise<Employee> {
        const res = await this.client.put<ApiEnvelope<Employee>>(this.url(this.endpoints.update, tenant, id), p);
        return res.data.data;
    }

    public async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.delete, tenant, id));
    }

    public async restore(tenant: string, id: number): Promise<Employee> {
        const res = await this.client.post<ApiEnvelope<Employee>>(this.url(this.endpoints.restore, tenant, id));
        return res.data.data;
    }

    public async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    public async bulk(tenant: string, action: EmployeeBulkAction, ids: number[]): Promise<EmployeeBulkResult> {
        const res = await this.client.post<ApiEnvelope<EmployeeBulkResult>>(
            this.url(this.endpoints.bulk, tenant),
            { action, ids },
        );
        return res.data.data;
    }
}

export const employeesApiService = EmployeesApiService.getInstance();
