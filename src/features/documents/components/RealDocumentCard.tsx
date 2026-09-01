import { memo } from 'react';
import DocumentCardGrid from './DocumentCardGrid';
import { mapApiDocumentToCard } from '../utils/mapApiDocumentToCard';
import type { ApiDocument } from '../types/api.types';

interface RealDocumentCardProps {
    document: ApiDocument;
}

/**
 * Adapter over the shared DocumentCardGrid for real API documents — same
 * reuse pattern as FavoriteDocumentCard/PinnedDocumentCard.
 */
function RealDocumentCard({ document }: RealDocumentCardProps) {
    const card = mapApiDocumentToCard(document);

    return (
        <DocumentCardGrid
            id={card.id}
            name={card.name}
            department={card.department}
            entity={card.entity}
            renewal={card.renewal}
            importance={card.importance}
            importanceLabel={card.importanceLabel}
            expiryDate={card.expiryDate}
            status={card.status}
        />
    );
}

export default memo(RealDocumentCard);
