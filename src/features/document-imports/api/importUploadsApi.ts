/**
 * ImportUploadsApiService — the chunked upload endpoints
 * (start, state, chunk, complete, cancel).
 *
 * Shared by bulk imports (`archive`, `manifest`) and document files
 * (`document_file`, served from /document-uploads): `kind` picks the base path.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import type { ApiEnvelope, ImportUpload, UploadKind } from '../types/import.types';

const endpointsFor = (kind: UploadKind) =>
    kind === 'document_file' ? apiEndpoints.documentUploads : apiEndpoints.documentImports;

export class ImportUploadsApiService {
    private static instance: ImportUploadsApiService;
    private readonly client = apiClient.getInstance();

    private constructor() {}

    public static getInstance(): ImportUploadsApiService {
        if (!ImportUploadsApiService.instance) {
            ImportUploadsApiService.instance = new ImportUploadsApiService();
        }
        return ImportUploadsApiService.instance;
    }

    public async start(
        tenant: string,
        body: { kind: UploadKind; file_name: string; size: number },
        signal?: AbortSignal,
    ): Promise<ImportUpload> {
        const res = await this.client.post<ApiEnvelope<ImportUpload>>(
            buildApiUrl(endpointsFor(body.kind).uploads, { tenant }),
            body,
            { signal },
        );
        return res.data.data;
    }

    public async get(tenant: string, kind: UploadKind, uploadId: string, signal?: AbortSignal): Promise<ImportUpload> {
        const res = await this.client.get<ApiEnvelope<ImportUpload>>(
            buildApiUrl(endpointsFor(kind).upload, { tenant, uploadId }),
            { signal },
        );
        return res.data.data;
    }

    /** Raw bytes, never JSON / multipart. Re-sending a chunk is safe (newest wins). */
    public async sendChunk(
        tenant: string,
        kind: UploadKind,
        uploadId: string,
        index: number,
        blob: Blob,
        signal?: AbortSignal,
    ): Promise<void> {
        await this.client.put(buildApiUrl(endpointsFor(kind).chunk, { tenant, uploadId, index }), blob, {
            headers: { 'Content-Type': 'application/octet-stream' },
            signal,
        });
    }

    public async complete(tenant: string, kind: UploadKind, uploadId: string, signal?: AbortSignal): Promise<void> {
        await this.client.post(buildApiUrl(endpointsFor(kind).completeUpload, { tenant, uploadId }), undefined, { signal });
    }

    public async cancel(tenant: string, kind: UploadKind, uploadId: string): Promise<void> {
        await this.client.delete(buildApiUrl(endpointsFor(kind).upload, { tenant, uploadId }));
    }
}

export const importUploadsApiService = ImportUploadsApiService.getInstance();
