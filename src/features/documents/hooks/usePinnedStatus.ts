/**
 * usePinnedStatus / useTogglePin
 *
 * Derives a documentId -> pinnedId lookup from the cached pinned-documents list,
 * and exposes a single toggle() action for card/header icon buttons to highlight
 * and flip pin state without each caller re-deriving the map.
 */

import { useMemo } from 'react';
import { usePinnedDocuments } from './usePinnedDocuments';
import { useCreatePinnedDocument } from './useCreatePinnedDocument';
import { useUnpinDocument } from './useUnpinDocument';

function usePinnedDocumentIdMap(): Map<number, number> {
    const { pinnedDocuments } = usePinnedDocuments();

    return useMemo(() => {
        const map = new Map<number, number>();
        pinnedDocuments.forEach((pinned) => {
            map.set(pinned.document.id, pinned.id);
        });
        return map;
    }, [pinnedDocuments]);
}

export function usePinnedStatus(documentId: number): {
    isPinned: boolean;
    pinnedId: number | null;
} {
    const map = usePinnedDocumentIdMap();
    const pinnedId = map.get(documentId) ?? null;
    return { isPinned: pinnedId !== null, pinnedId };
}

interface UseTogglePinResult {
    isPinned: boolean;
    isPending: boolean;
    toggle: () => void;
}

export function useTogglePin(documentId: number): UseTogglePinResult {
    const { isPinned, pinnedId } = usePinnedStatus(documentId);
    const { mutate: pinDoc, isPending: isPinning } = useCreatePinnedDocument();
    const { mutate: unpinDoc, isPending: isUnpinning } = useUnpinDocument();

    const toggle = () => {
        if (isPinned && pinnedId !== null) {
            unpinDoc(pinnedId);
        } else {
            pinDoc(documentId);
        }
    };

    return { isPinned, isPending: isPinning || isUnpinning, toggle };
}
