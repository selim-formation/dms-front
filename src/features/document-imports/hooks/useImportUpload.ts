import { useCallback, useEffect, useReducer, useRef } from 'react';
import { uploadFile } from '../api/uploadFile';
import { importUploadsApiService } from '../api/importUploadsApi';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { clearStoredUpload, readStoredUpload, writeStoredUpload } from '../utils/uploadStorage';
import { errorMessage } from '@/features/departments/utils/departmentErrors';
import type { ImportUpload, UploadKind } from '../types/import.types';

export type UploadPhase = 'idle' | 'uploading' | 'assembling' | 'done' | 'error';

export interface UploadState {
    phase: UploadPhase;
    sent: number;
    total: number;
    error: string | null;
    /** HTTP status of the failure (429 = too many unfinished uploads). */
    status?: number;
}

const IDLE: UploadState = { phase: 'idle', sent: 0, total: 0, error: null };

type Action = Partial<UploadState> & { type: 'patch' | 'reset' };

function reducer(state: UploadState, action: Action): UploadState {
    if (action.type === 'reset') return IDLE;
    const { type, ...patch } = action;
    void type;
    return { ...state, ...patch };
}

/**
 * State machine for one file kind. A completed upload is cached per File, so
 * retrying a failed "create" never re-uploads; the unfinished upload id is
 * remembered in localStorage to resume after a refresh (re-select the same file).
 */
export function useImportUpload(kind: UploadKind) {
    const tenant = useTenantId();
    const [state, dispatch] = useReducer(reducer, IDLE);
    const controller = useRef<AbortController | null>(null);
    const uploadId = useRef<string | null>(null);
    const cache = useRef<{ file: File; upload: ImportUpload } | null>(null);
    const lastFile = useRef<File | null>(null);

    // Leaving mid-upload stops the requests but keeps the upload resumable.
    useEffect(() => () => controller.current?.abort(), []);

    const upload = useCallback(
        async (file: File): Promise<ImportUpload> => {
            if (!tenant) throw new Error('Tenant is required');
            if (cache.current?.file === file) return cache.current.upload;

            lastFile.current = file;
            const ctrl = new AbortController();
            controller.current = ctrl;
            dispatch({ type: 'patch', phase: 'uploading', sent: 0, total: file.size, error: null, status: undefined });

            try {
                const result = await uploadFile(tenant, {
                    kind,
                    file,
                    resumeId: readStoredUpload(tenant, kind, file),
                    signal: ctrl.signal,
                    onStarted: (id) => {
                        uploadId.current = id;
                        writeStoredUpload(tenant, kind, { id, name: file.name, size: file.size });
                    },
                    onProgress: (sent) => dispatch({ type: 'patch', sent }),
                    onAssembling: () => dispatch({ type: 'patch', phase: 'assembling', sent: file.size }),
                });
                cache.current = { file, upload: result };
                dispatch({ type: 'patch', phase: 'done', sent: file.size });
                return result;
            } catch (e) {
                if (!ctrl.signal.aborted) {
                    dispatch({
                        type: 'patch',
                        phase: 'error',
                        error: errorMessage(e) ?? (e instanceof Error ? e.message : null),
                        status: (e as { status?: number })?.status,
                    });
                }
                throw e;
            }
        },
        [tenant, kind],
    );

    /** Stops sending and deletes the server-side chunks (best effort). */
    const cancel = useCallback(() => {
        controller.current?.abort();
        const id = uploadId.current;
        if (tenant && id && !cache.current) {
            importUploadsApiService.cancel(tenant, kind, id).catch(() => undefined);
            clearStoredUpload(tenant, kind, lastFile.current ?? undefined);
        }
        uploadId.current = null;
        dispatch({ type: 'reset' });
    }, [tenant, kind]);

    /** Forget the cached upload (file changed, or the server said it can't be used). */
    const reset = useCallback(() => {
        cache.current = null;
        uploadId.current = null;
        dispatch({ type: 'reset' });
    }, []);

    /** Called once an import exists: the upload is consumed. */
    const forget = useCallback(() => {
        if (tenant) clearStoredUpload(tenant, kind, lastFile.current ?? undefined);
        cache.current = null;
    }, [tenant, kind]);

    return { state, upload, cancel, reset, forget };
}
