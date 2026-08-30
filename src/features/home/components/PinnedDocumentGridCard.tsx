import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentCardGrid from '@/features/documents/components/DocumentCardGrid';
import type { PinnedDocumentData } from '@/features/documents/types/pinned.types';

interface PinnedDocumentGridCardProps {
    pinned: PinnedDocumentData;
}

function truncate(text: string, max: number): string {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/**
 * Adapter over the shared browse-grid `DocumentCardGrid` — reuses that exact
 * card (same header, tags, expiry/status rows, view/download actions,
 * pin/favorite toggles) for the home page's "Pinned Documents" widget instead
 * of a bespoke card, mapping pinned-document fields onto its slots.
 */
function PinnedDocumentGridCard({ pinned }: PinnedDocumentGridCardProps) {
    const { t } = useTranslation(['home', 'documents', 'common']);
    const pinnedOn = new Date(pinned.created_at).toLocaleDateString();

    return (
        <DocumentCardGrid
            id={String(pinned.document.id)}
            name={pinned.document.title}
            department={t('pinnedDocuments.pinnedBy') + ' ' + pinned.user.name}
            entity={pinned.document.description ? truncate(pinned.document.description, 24) : t('pinnedDocuments.title')}
            renewal="Renewable"
            renewalLabel={t('pinnedDocuments.title')}
            importance="Medium"
            importanceLabel={pinnedOn}
            expiryDate={pinnedOn}
            status="Expires"
            statusLabel={t('common:status.active')}
        />
    );
}

export default memo(PinnedDocumentGridCard);
