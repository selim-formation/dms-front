/**
 * Document Download API
 * Streams the file as a blob (not JSON) — 403s if the caller lacks
 * download rights (no real org access, or a view-only share).
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('documentDownloadApi');

export function filenameFromContentDisposition(header: string | undefined): string | null {
    if (!header) return null;
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
    return match ? decodeURIComponent(match[1]) : null;
}

/** Streams `endpoint` as a blob and triggers a browser save. Shared by document and share downloads. */
export async function downloadBlobToDisk(
    endpoint: string,
    fallbackFilename: string,
    versionId?: number,
): Promise<void> {
    const response = await apiClient.getInstance().get<Blob>(endpoint, {
        responseType: 'blob',
        params: versionId ? { version_id: versionId } : undefined,
    });

    const filename = filenameFromContentDisposition(response.headers['content-disposition']) ?? fallbackFilename;
    const objectUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
}

export async function downloadDocumentFile(
    tenant: string,
    documentId: number,
    fallbackFilename: string,
    versionId?: number,
): Promise<void> {
    try {
        await downloadBlobToDisk(`api/${tenant}/documents/${documentId}/download`, fallbackFilename, versionId);
    } catch (error) {
        log.error('Failed to download document', { error, documentId });
        throw error;
    }
}

/** Download through a share grant — requires an active share with can_download. */
export async function downloadShareFile(
    tenant: string,
    shareId: number,
    fallbackFilename: string,
    versionId?: number,
): Promise<void> {
    try {
        await downloadBlobToDisk(buildApiUrl(apiEndpoints.documentShares.download, { tenant, id: shareId }), fallbackFilename, versionId);
    } catch (error) {
        log.error('Failed to download shared document', { error, shareId });
        throw error;
    }
}
