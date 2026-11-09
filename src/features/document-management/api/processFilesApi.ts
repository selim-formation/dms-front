/**
 * ProcessFilesApiService — creation / renewal procedure files of a document:
 * /api/{tenant}/document-management/{id}/process-files
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type { ApiEnvelope } from '../types/management.types';
import type { PreviewLink, ProcessFilesState, ProcessKind } from '../types/version.types';

const log = logger.createScoped('ProcessFilesApiService');

export class ProcessFilesApiService {
    private static instance: ProcessFilesApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints.processFiles;

    private constructor() {
        log.info('ProcessFilesApiService initialized');
    }

    public static getInstance(): ProcessFilesApiService {
        if (!ProcessFilesApiService.instance) {
            ProcessFilesApiService.instance = new ProcessFilesApiService();
        }
        return ProcessFilesApiService.instance;
    }

    public async fetchState(tenant: string, documentId: number, signal?: AbortSignal): Promise<ProcessFilesState> {
        const res = await this.client.get<ApiEnvelope<ProcessFilesState>>(
            buildApiUrl(this.endpoints.state, { tenant, id: documentId }),
            { signal },
        );
        return res.data.data;
    }

    /** Old file is removed at once; the new one is stored in the background (poll `fetchState`). */
    public async attach(tenant: string, documentId: number, kind: ProcessKind, uploadId: string): Promise<void> {
        await this.client.put(buildApiUrl(this.endpoints.file, { tenant, id: documentId, kind }), { upload_id: uploadId });
    }

    public async remove(tenant: string, documentId: number, kind: ProcessKind): Promise<void> {
        await this.client.delete(buildApiUrl(this.endpoints.file, { tenant, id: documentId, kind }));
    }

    public async preview(tenant: string, documentId: number, kind: ProcessKind): Promise<PreviewLink> {
        const res = await this.client.get<ApiEnvelope<PreviewLink>>(
            buildApiUrl(this.endpoints.preview, { tenant, id: documentId, kind }),
        );
        return res.data.data;
    }
}

export const processFilesApiService = ProcessFilesApiService.getInstance();
