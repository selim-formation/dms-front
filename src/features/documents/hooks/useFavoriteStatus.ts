/**
 * useFavoriteStatus / useToggleFavorite
 *
 * Derives a documentId -> favoriteId lookup from the cached favorites list,
 * and exposes a single toggle() action for card/header icon buttons to highlight
 * and flip favorite state without each caller re-deriving the map.
 *
 * per_page is set high here (not the UI page size) because this query's sole
 * purpose is a full "which documents are favorited" lookup, not a paginated view.
 */

import { useMemo } from 'react';
import { useFavorites } from './useFavorites';
import { useCreateFavorite } from './useCreateFavorite';
import { useDeleteFavorite } from './useDeleteFavorite';

const FAVORITES_STATUS_PAGE_SIZE = 1000;

function useFavoriteDocumentIdMap(): Map<number, number> {
    const { favorites } = useFavorites({ per_page: FAVORITES_STATUS_PAGE_SIZE, page: 1 });

    return useMemo(() => {
        const map = new Map<number, number>();
        favorites.forEach((favorite) => {
            map.set(favorite.document.id, favorite.id);
        });
        return map;
    }, [favorites]);
}

export function useFavoriteStatus(documentId: number): {
    isFavorited: boolean;
    favoriteId: number | null;
} {
    const map = useFavoriteDocumentIdMap();
    const favoriteId = map.get(documentId) ?? null;
    return { isFavorited: favoriteId !== null, favoriteId };
}

interface UseToggleFavoriteResult {
    isFavorited: boolean;
    isPending: boolean;
    toggle: () => void;
}

export function useToggleFavorite(documentId: number): UseToggleFavoriteResult {
    const { isFavorited, favoriteId } = useFavoriteStatus(documentId);
    const { mutate: addFavorite, isPending: isAdding } = useCreateFavorite();
    const { mutate: removeFavorite, isPending: isRemoving } = useDeleteFavorite();

    const toggle = () => {
        if (isFavorited && favoriteId !== null) {
            removeFavorite(favoriteId);
        } else {
            addFavorite(documentId);
        }
    };

    return { isFavorited, isPending: isAdding || isRemoving, toggle };
}
