/**
 * Document Shares API Functions
 * Thin functional wrapper around DocumentSharesApiService
 */

import { documentSharesApiService } from './documentSharesApi';
import type {
    CreateDocumentSharePayload,
    DocumentShareData,
    DocumentSharesListParams,
    DocumentSharesPaginatedData,
    UpdateDocumentSharePayload,
} from '../types/documentShare.types';

export async function getGivenShares(
    tenant: string,
    params: DocumentSharesListParams = {}
): Promise<DocumentSharesPaginatedData> {
    return documentSharesApiService.fetchGiven(tenant, params);
}

export async function getReceivedShares(
    tenant: string,
    params: DocumentSharesListParams = {}
): Promise<DocumentSharesPaginatedData> {
    return documentSharesApiService.fetchReceived(tenant, params);
}

export async function getShare(tenant: string, shareId: number): Promise<DocumentShareData> {
    return documentSharesApiService.fetchOne(tenant, shareId);
}

export async function createShare(
    tenant: string,
    payload: CreateDocumentSharePayload
): Promise<DocumentShareData> {
    return documentSharesApiService.create(tenant, payload);
}

export async function updateShare(
    tenant: string,
    shareId: number,
    payload: UpdateDocumentSharePayload
): Promise<DocumentShareData> {
    return documentSharesApiService.update(tenant, shareId, payload);
}

export async function revokeShare(tenant: string, shareId: number): Promise<void> {
    return documentSharesApiService.revoke(tenant, shareId);
}
