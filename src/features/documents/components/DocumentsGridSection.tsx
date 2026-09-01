import React from 'react';
import { useTranslation } from 'react-i18next';
import RealDocumentCard from './RealDocumentCard';
import type { ApiDocument } from '../types/api.types';

interface DocumentsGridSectionProps {
    documents: ApiDocument[];
    searchQuery: string;
    onUploadClick?: () => void;
}

const DocumentsGridSection: React.FC<DocumentsGridSectionProps> = ({
    documents,
    searchQuery,
    onUploadClick,
}) => {
    const { t } = useTranslation(['documents', 'common']);
    const DocumentEmptyState = React.lazy(() => import('./DocumentEmptyState'));

    if (documents.length === 0) {
        return (
            <React.Suspense fallback={<div className="text-center py-12">{t('common:common.loading')}</div>}>
                <DocumentEmptyState searchQuery={searchQuery} onUploadClick={onUploadClick} />
            </React.Suspense>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
                <RealDocumentCard key={doc.id} document={doc} />
            ))}
        </div>
    );
};

export default React.memo(DocumentsGridSection);
