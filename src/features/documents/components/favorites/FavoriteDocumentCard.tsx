import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentCardGrid from '../DocumentCardGrid';
import type { FavoriteData } from '../../types/favorites.types';

interface FavoriteDocumentCardProps {
    favorite: FavoriteData;
}

function truncate(text: string, max: number): string {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/**
 * Adapter over the shared browse-grid `DocumentCardGrid` — reuses that exact
 * card (same header, tags, expiry/status rows, view/download actions)
 * instead of a bespoke favorite card, mapping favorite fields onto its slots.
 */
function FavoriteDocumentCard({ favorite }: FavoriteDocumentCardProps) {
    const { t } = useTranslation(['documents', 'common']);
    const favoritedOn = new Date(favorite.created_at).toLocaleDateString();

    return (
        <DocumentCardGrid
            id={String(favorite.document.id)}
            name={favorite.document.title}
            department={favorite.note ? truncate(favorite.note, 24) : t('favoritesPage.noteEmpty')}
            entity={favorite.document.description ? truncate(favorite.document.description, 24) : t('favoritesPage.title')}
            renewal="Renewable"
            renewalLabel={t('favoritesPage.title')}
            importance="Medium"
            importanceLabel={favoritedOn}
            expiryDate={favoritedOn}
            status="Expires"
            statusLabel={t('common:status.active')}
        />
    );
}

export default memo(FavoriteDocumentCard);
