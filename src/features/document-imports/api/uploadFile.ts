/**
 * Resumable chunked upload: start (or resume) → send missing chunks (4 in
 * parallel, retried) → complete → poll until assembled.
 * Pure orchestration: React state lives in hooks/useImportUpload.
 */

import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors';
import { importUploadsApiService as api } from './importUploadsApi';
import { UPLOAD_CONCURRENCY, UPLOAD_MAX_ATTEMPTS, UPLOAD_POLL_MS } from '../utils/importPayload';
import type { ImportUpload, UploadKind } from '../types/import.types';

export interface UploadFileOptions {
    kind: UploadKind;
    file: File;
    resumeId?: string;
    signal?: AbortSignal;
    onStarted?: (uploadId: string) => void;
    /** Bytes confirmed by the server so far. */
    onProgress?: (sentBytes: number) => void;
    onAssembling?: () => void;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
        const timer = setTimeout(resolve, ms);
        signal?.addEventListener(
            'abort',
            () => {
                clearTimeout(timer);
                reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true },
        );
    });
}

/** Picks up an earlier upload when it is still usable; otherwise starts a new one. */
async function open(tenant: string, o: UploadFileOptions): Promise<ImportUpload> {
    if (o.resumeId) {
        try {
            const prev = await api.get(tenant, o.resumeId, o.signal);
            const same = prev.size === o.file.size && prev.file_name === o.file.name && prev.kind === o.kind;
            if (same && ['uploading', 'assembling', 'complete'].includes(prev.status)) return prev;
        } catch (e) {
            if (o.signal?.aborted || errorStatus(e) !== 404) throw e;
        }
    }
    return api.start(tenant, { kind: o.kind, file_name: o.file.name, size: o.file.size }, o.signal);
}

async function sendWithRetry(tenant: string, upload: ImportUpload, file: File, index: number, signal: AbortSignal) {
    const start = index * upload.chunk_size;
    const blob = file.slice(start, Math.min(file.size, start + upload.chunk_size));
    for (let attempt = 1; ; attempt++) {
        try {
            await api.sendChunk(tenant, upload.id, index, blob, signal);
            return blob.size;
        } catch (e) {
            const status = errorStatus(e);
            const fatal = signal.aborted || attempt >= UPLOAD_MAX_ATTEMPTS || (status !== undefined && status >= 400 && status < 500 && status !== 429);
            if (fatal) throw e;
            await sleep(500 * 2 ** attempt, signal);
        }
    }
}

export async function uploadFile(tenant: string, o: UploadFileOptions): Promise<ImportUpload> {
    let upload = await open(tenant, o);
    o.onStarted?.(upload.id);
    if (upload.status === 'complete') return upload;

    if (upload.status === 'uploading') {
        const todo = Array.from({ length: upload.total_chunks }, (_, i) => i).filter((i) => !upload.received_chunks.includes(i));
        let sent = Math.min(o.file.size, upload.received_chunks.length * upload.chunk_size);
        o.onProgress?.(sent);

        // One failing worker stops its siblings instead of leaving them sending.
        const stop = new AbortController();
        const forward = () => stop.abort();
        o.signal?.addEventListener('abort', forward, { once: true });
        const current = upload;

        const worker = async () => {
            while (todo.length && !stop.signal.aborted) {
                const index = todo.shift()!;
                sent += await sendWithRetry(tenant, current, o.file, index, stop.signal);
                o.onProgress?.(Math.min(sent, o.file.size));
            }
        };

        try {
            await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, todo.length) }, worker));
        } catch (e) {
            stop.abort();
            throw e;
        } finally {
            o.signal?.removeEventListener('abort', forward);
        }

        await api.complete(tenant, upload.id, o.signal);
    }

    o.onAssembling?.();
    do {
        await sleep(UPLOAD_POLL_MS, o.signal);
        upload = await api.get(tenant, upload.id, o.signal);
    } while (upload.status === 'assembling' || upload.status === 'uploading');

    if (upload.status !== 'complete') throw new Error(upload.error ?? errorMessage(null) ?? 'Upload failed');
    return upload;
}
