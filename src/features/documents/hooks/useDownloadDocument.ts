/**
 * useDownloadDocument Hook
 *
 * Triggers a document file download (blob → browser save).
 * 403s server-side if the caller has no real download rights.
 */

import { useMutation } from '@tanstack/react-query';
import { downloadDocumentFile } from '../api/documentDownload-api';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('useDownloadDocument');

interface DownloadDocumentInput {
    documentId: number;
    filename: string;
    /** Omit for the latest version — see /documents/{id}/download's `?version_id=`. */
    versionId?: number;
}

interface UseDownloadDocumentOptions {
    onError?: (error: Error) => void;
}

interface UseDownloadDocumentResult {
    download: (input: DownloadDocumentInput) => void;
    isDownloading: boolean;
    isError: boolean;
    error: Error | null;
}

export function useDownloadDocument(options: UseDownloadDocumentOptions = {}): UseDownloadDocumentResult {
    const tenant = useTenantId();
    const { onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async ({ documentId, filename, versionId }: DownloadDocumentInput) => {
            if (!tenant) {
                log.error('Tenant is not available for document download');
                throw new Error('Tenant is required to download a document');
            }
            return downloadDocumentFile(tenant, documentId, filename, versionId);
        },
        onError: (error: Error) => {
            log.error('Document download failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        download: (input) => mutation.mutate(input),
        isDownloading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
}
