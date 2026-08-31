import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentCardGrid from '../DocumentCardGrid';
import type { PinnedDocumentData } from '../../types/pinned.types';

interface PinnedDocumentCardProps {
    pinned: PinnedDocumentData;
}

function truncate(text: string, max: number): string {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/**
 * Adapter over the shared browse-grid `DocumentCardGrid` — same reuse
 * pattern as FavoriteDocumentCard, mapping pinned-document fields onto
 * its slots instead of a bespoke pinned card. The pin/unpin action is
 * already built into DocumentCardGrid's own pin icon (via useTogglePin),
 * so this adapter needs no explicit unpin handler.
 */
function PinnedDocumentCard({ pinned }: PinnedDocumentCardProps) {
    const { t } = useTranslation(['documents', 'common']);
    const pinnedOn = new Date(pinned.created_at).toLocaleDateString();

    return (
        <DocumentCardGrid
            id={String(pinned.document.id)}
            name={pinned.document.title}
            department={`${t('pinnedDocumentCard.pinnedBy')}: ${truncate(pinned.user.name, 20)}`}
            entity={
                pinned.document.description
                    ? truncate(pinned.document.description, 24)
                    : t('pinnedDocumentCard.title')
            }
            renewal="Renewable"
            renewalLabel={t('pinnedDocumentCard.title')}
            importance="Medium"
            importanceLabel={pinnedOn}
            expiryDate={pinnedOn}
            status="Expires"
            statusLabel={t('common:status.active')}
        />
    );
}

export default memo(PinnedDocumentCard);
