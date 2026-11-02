/**
 * DocumentImportsApiService — list / show / create / rows / commit / retry /
 * rollback and CSV downloads for /api/{tenant}/document-imports.
 * (No update or delete exist: an import is a workflow.)
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import { buildImportParams, buildRowParams, cleanCreatePayload } from '../utils/importPayload';
import type {
    ApiEnvelope,
    CreateImportPayload,
    DocumentImport,
    ImportAction,
    ImportFilters,
    ImportRow,
    Paginated,
    RowFilters,
} from '../types/import.types';

const log = logger.createScoped('DocumentImportsApiService');

export class DocumentImportsApiService {
    private static instance: DocumentImportsApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.documentImports;

    private constructor() {
        log.info('DocumentImportsApiService initialized');
    }

    public static getInstance(): DocumentImportsApiService {
        if (!DocumentImportsApiService.instance) {
            DocumentImportsApiService.instance = new DocumentImportsApiService();
        }
        return DocumentImportsApiService.instance;
    }

    private url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    public async fetchList(tenant: string, filters: ImportFilters, signal?: AbortSignal): Promise<Paginated<DocumentImport>> {
        const res = await this.client.get<ApiEnvelope<Paginated<DocumentImport>>>(
            this.url(this.endpoints.list, tenant),
            { params: buildImportParams(filters), signal },
        );
        return res.data.data;
    }

    public async fetchOne(tenant: string, id: number, signal?: AbortSignal): Promise<DocumentImport> {
        const res = await this.client.get<ApiEnvelope<DocumentImport>>(this.url(this.endpoints.detail, tenant, id), { signal });
        return res.data.data;
    }

    public async fetchRows(tenant: string, id: number, filters: RowFilters, signal?: AbortSignal): Promise<Paginated<ImportRow>> {
        const res = await this.client.get<ApiEnvelope<Paginated<ImportRow>>>(
            this.url(this.endpoints.rows, tenant, id),
            { params: buildRowParams(filters), signal },
        );
        return res.data.data;
    }

    public async create(tenant: string, payload: CreateImportPayload): Promise<DocumentImport> {
        const res = await this.client.post<ApiEnvelope<DocumentImport>>(
            this.url(this.endpoints.create, tenant),
            cleanCreatePayload(payload),
        );
        return res.data.data;
    }

    /** commit / retry / rollback all answer with the updated import. */
    public async act(tenant: string, id: number, action: ImportAction): Promise<DocumentImport> {
        const res = await this.client.post<ApiEnvelope<DocumentImport>>(this.url(this.endpoints[action], tenant, id));
        return res.data.data;
    }

    public async downloadProblems(tenant: string, id: number): Promise<Blob> {
        const res = await this.client.get<Blob>(this.url(this.endpoints.problems, tenant, id), { responseType: 'blob' });
        return res.data;
    }

    public async downloadManifestTemplate(tenant: string): Promise<Blob> {
        const res = await this.client.get<Blob>(this.url(this.endpoints.manifestTemplate, tenant), { responseType: 'blob' });
        return res.data;
    }
}

export const documentImportsApiService = DocumentImportsApiService.getInstance();
