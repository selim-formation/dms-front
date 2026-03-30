/**
 * Pinned Documents API Functions
 * 
 * Handles API calls for pinned documents with real API integration
 * Uses PinnedDocumentsApiService and data transformations
 */

import { pinnedDocumentsApiService } from './pinnedDocumentsApi';
import { logger } from '@/shared/utils/logger';
import type { PinnedDocumentData } from '../types/pinned.types';

const log = logger.createScoped('pinnedDocumentsApi');

/**
 * Fetch all pinned documents from API
 * 
 * @param tenant - Tenant identifier
 * @returns Promise with array of pinned documents
 */
export async function getPinnedDocuments(
    tenant: string
): Promise<PinnedDocumentData[]> {
    try {
        log.info('Fetching all pinned documents from API', { tenant });

        const pinnedDocs = await pinnedDocumentsApiService.fetchPinnedDocuments(
            tenant
        );

        log.info(`Successfully fetched ${pinnedDocs.length} pinned documents`);

        return pinnedDocs;
    } catch (error) {
        log.error('Failed to fetch all pinned documents', { error });
        throw error;
    }
}

/**
 * Fetch last pinned documents from API
 * 
 * @param tenant - Tenant identifier
 * @returns Promise with array of last pinned documents
 */
export async function getLastPinnedDocuments(
    tenant: string
): Promise<PinnedDocumentData[]> {
    try {
        log.info('Fetching last pinned documents from API', { tenant });

        const pinnedDocs = await pinnedDocumentsApiService.fetchLastPinnedDocuments(
            tenant
        );

        log.info(`Successfully fetched ${pinnedDocs.length} last pinned documents`);

        return pinnedDocs;
    } catch (error) {
        log.error('Failed to fetch last pinned documents', { error });
        throw error;
    }
}

/**
 * Pin a document from API
 * 
 * @param tenant - Tenant identifier
 * @param documentId - Document ID to pin
 * @returns Promise with pinned document data or null if already pinned
 */
export async function pinDocument(
    tenant: string,
    documentId: number
): Promise<PinnedDocumentData | null> {
    try {
        log.info('Pinning document from API', { tenant, documentId });

        const pinnedDoc = await pinnedDocumentsApiService.pinDocument(
            tenant,
            documentId
        );

        log.info('Successfully pinned document', { documentId });

        return pinnedDoc;
    } catch (error) {
        log.error('Failed to pin document', { error });
        throw error;
    }
}

/**
 * Unpin a document from API
 * 
 * @param tenant - Tenant identifier
 * @param pinnedDocumentId - Pinned document ID to unpin
 * @returns Promise that resolves when document is unpinned
 */
export async function unpinDocument(
    tenant: string,
    pinnedDocumentId: number
): Promise<void> {
    try {
        log.info('Unpinning document from API', { tenant, pinnedDocumentId });

        await pinnedDocumentsApiService.unpinDocument(tenant, pinnedDocumentId);

        log.info('Successfully unpinned document', { pinnedDocumentId });
    } catch (error) {
        log.error('Failed to unpin document', { error });
        throw error;
    }
}
