/**
 * TanStack Query Key Factory for Document Shares
 */

import type { DocumentSharesListParams } from '../types/documentShare.types';

export const documentSharesKeys = {
    all: ['document-shares'] as const,
    given: () => [...documentSharesKeys.all, 'given'] as const,
    givenList: (params?: DocumentSharesListParams) =>
        [...documentSharesKeys.given(), params ?? {}] as const,
    received: () => [...documentSharesKeys.all, 'received'] as const,
    receivedList: (params?: DocumentSharesListParams) =>
        [...documentSharesKeys.received(), params ?? {}] as const,
    details: () => [...documentSharesKeys.all, 'detail'] as const,
    detail: (shareId: number) => [...documentSharesKeys.details(), shareId] as const,
};
