import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import DocumentCardGrid from './DocumentCardGrid';

interface RelatedDocument {
    id: string;
    title: string;
    type: string;
}

interface DocumentRelatedProps {
    documents: RelatedDocument[];
    onDocumentClick?: (id: string) => void;
}

/**
 * Related documents — reuses the shared browse-grid `DocumentCardGrid` (same
 * card as the documents page) instead of a bespoke compact list, so a related
 * document gets the same pin/favorite/view/download affordances everywhere.
 */
const DocumentRelated: React.FC<DocumentRelatedProps> = ({ documents, onDocumentClick }) => {
    const { t } = useTranslation(['documents', 'common']);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{t('documentRelated.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documents.map((rd) => (
                        <DocumentCardGrid
                            key={rd.id}
                            id={rd.id}
                            name={rd.title}
                            department={rd.type.toUpperCase()}
                            entity={t('documentRelated.title')}
                            renewal="One-Time"
                            renewalLabel={t('documentRelated.title')}
                            importance="Medium"
                            importanceLabel={t('common:status.active')}
                            expiryDate={t('documentDetails.notAvailable')}
                            status="Expires"
                            onView={onDocumentClick ? () => onDocumentClick(rd.id) : undefined}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentRelated);
