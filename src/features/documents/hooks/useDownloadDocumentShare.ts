/**
 * useDownloadDocumentShare Hook
 *
 * Downloads a document through a share grant (blob → browser save).
 * 403s server-side unless the share is active and has can_download.
 */

import { useMutation } from '@tanstack/react-query';
import { downloadShareFile } from '../api/documentDownload-api';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('useDownloadDocumentShare');

interface DownloadShareInput {
    shareId: number;
    filename: string;
    versionId?: number;
}

interface UseDownloadDocumentShareOptions {
    onError?: (error: Error) => void;
}

export function useDownloadDocumentShare(options: UseDownloadDocumentShareOptions = {}) {
    const tenant = useTenantId();
    const { onError: onErrorCallback } = options;

    const mutation = useMutation({
        mutationFn: async ({ shareId, filename, versionId }: DownloadShareInput) => {
            if (!tenant) {
                log.error('Tenant is not available for share download');
                throw new Error('Tenant is required to download a shared document');
            }
            return downloadShareFile(tenant, shareId, filename, versionId);
        },
        onError: (error: Error) => {
            log.error('Share download failed', { error });
            onErrorCallback?.(error);
        },
    });

    return {
        download: (input: DownloadShareInput) => mutation.mutate(input),
        isDownloading: mutation.isPending,
    };
}
