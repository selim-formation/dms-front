import { useCallback, useEffect, useRef, useState } from 'react';
import { useImportUpload } from '@/features/document-imports/hooks/useImportUpload';
import { validateImage, type ImageProblem } from '../utils/galleryPayload';

export interface PickerStatus {
    uploadId: string | null;
    fileName: string | null;
    uploading: boolean;
}

/**
 * One picture's file state: validates it, uploads it at once (own progress state) and
 * reports only `{uploadId, uploading}` upward, so a progress tick re-renders this row alone.
 * `onStatus` must be stable.
 */
export function useImagePicker(onStatus: (s: PickerStatus) => void) {
    const { state, upload, cancel, reset, forget } = useImportUpload('document_file');
    const [file, setFile] = useState<File | null>(null);
    const [problem, setProblem] = useState<ImageProblem | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // The preview URL is created in the event handler (not an effect) and revoked when replaced or on unmount.
    const urlRef = useRef<string | null>(null);
    const setPreview = useCallback((next: File | null) => {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = next ? URL.createObjectURL(next) : null;
        setPreviewUrl(urlRef.current);
    }, []);
    useEffect(() => () => {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    }, []);

    const pick = useCallback(
        (next: File | null) => {
            setProblem(null);
            if (!next) {
                setFile(null);
                setPreview(null);
                cancel();
                onStatus({ uploadId: null, fileName: null, uploading: false });
                return;
            }
            const invalid = validateImage(next);
            if (invalid) {
                setFile(null);
                setPreview(null);
                setProblem(invalid);
                return;
            }
            setFile(next);
            setPreview(next);
            reset();
            onStatus({ uploadId: null, fileName: next.name, uploading: true });
            upload(next)
                .then((done) => {
                    onStatus({ uploadId: done.id, fileName: next.name, uploading: false });
                    forget(); // consumed once saved; no stale resume record
                })
                .catch(() => onStatus({ uploadId: null, fileName: next.name, uploading: false }));
        },
        [cancel, reset, upload, forget, onStatus, setPreview],
    );

    return { file, problem, state, previewUrl, pick, cancel };
}
