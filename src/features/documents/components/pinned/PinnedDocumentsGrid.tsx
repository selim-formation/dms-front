import { memo } from 'react';
import PinnedDocumentCard from './PinnedDocumentCard';
import type { PinnedDocumentData } from '../../types/pinned.types';

interface PinnedDocumentsGridProps {
    pinnedDocuments: PinnedDocumentData[];
}

function PinnedDocumentsGrid({ pinnedDocuments }: PinnedDocumentsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedDocuments.map((pinned) => (
                <PinnedDocumentCard key={pinned.id} pinned={pinned} />
            ))}
        </div>
    );
}

export default memo(PinnedDocumentsGrid);
