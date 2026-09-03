/**
 * Document Download API
 * Streams the file as a blob (not JSON) — 403s if the caller lacks
 * download rights (no real org access, or a view-only share).
 */

import { apiClient } from '@/core/api/client';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('documentDownloadApi');

function filenameFromContentDisposition(header: string | undefined): string | null {
    if (!header) return null;
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function downloadDocumentFile(
    tenant: string,
    documentId: number,
    fallbackFilename: string,
    versionId?: number,
): Promise<void> {
    try {
        const client = apiClient.getInstance();
        const response = await client.get<Blob>(`api/${tenant}/documents/${documentId}/download`, {
            responseType: 'blob',
            params: versionId ? { version_id: versionId } : undefined,
        });

        const filename = filenameFromContentDisposition(response.headers['content-disposition']) ?? fallbackFilename;
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        log.error('Failed to download document', { error, documentId });
        throw error;
    }
}
