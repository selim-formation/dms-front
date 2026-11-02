/**
 * Remembers the unfinished upload of each kind so a refresh can resume it.
 * Per-viewer convenience only: every access is guarded (storage may be blocked).
 */

import type { UploadKind } from '../types/import.types';

export interface StoredUpload {
    id: string;
    name: string;
    size: number;
}

const storageKey = (tenant: string, kind: UploadKind) => `dms:import-upload:${tenant}:${kind}`;

export function readStoredUpload(tenant: string, kind: UploadKind, file: File): string | undefined {
    try {
        const raw = localStorage.getItem(storageKey(tenant, kind));
        if (!raw) return undefined;
        const stored = JSON.parse(raw) as StoredUpload;
        return stored.name === file.name && stored.size === file.size ? stored.id : undefined;
    } catch {
        return undefined;
    }
}

export function writeStoredUpload(tenant: string, kind: UploadKind, value: StoredUpload): void {
    try {
        localStorage.setItem(storageKey(tenant, kind), JSON.stringify(value));
    } catch {
        /* resume is a convenience */
    }
}

export function clearStoredUpload(tenant: string, kind: UploadKind): void {
    try {
        localStorage.removeItem(storageKey(tenant, kind));
    } catch {
        /* ignore */
    }
}
