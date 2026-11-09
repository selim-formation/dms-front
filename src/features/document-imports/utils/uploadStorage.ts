/**
 * Remembers unfinished uploads so a refresh can resume them.
 * Per-viewer convenience only: every access is guarded (storage may be blocked).
 * Import archive / manifest: one record per kind. Document files: one per
 * (name, size), because a document can have many version files at once.
 */

import type { UploadKind } from '../types/import.types';

export interface StoredUpload {
    id: string;
    name: string;
    size: number;
}

const storageKey = (tenant: string, kind: UploadKind, file?: { name: string; size: number }) =>
    kind === 'document_file' && file
        ? `dms:upload:${tenant}:${kind}:${file.size}:${file.name}`
        : `dms:import-upload:${tenant}:${kind}`;

export function readStoredUpload(tenant: string, kind: UploadKind, file: File): string | undefined {
    try {
        const raw = localStorage.getItem(storageKey(tenant, kind, file));
        if (!raw) return undefined;
        const stored = JSON.parse(raw) as StoredUpload;
        return stored.name === file.name && stored.size === file.size ? stored.id : undefined;
    } catch {
        return undefined;
    }
}

export function writeStoredUpload(tenant: string, kind: UploadKind, value: StoredUpload): void {
    try {
        localStorage.setItem(storageKey(tenant, kind, value), JSON.stringify(value));
    } catch {
        /* resume is a convenience */
    }
}

export function clearStoredUpload(tenant: string, kind: UploadKind, file?: { name: string; size: number }): void {
    try {
        localStorage.removeItem(storageKey(tenant, kind, file));
    } catch {
        /* ignore */
    }
}
