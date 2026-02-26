import React from 'react';
import DocumentCardGrid from './DocumentCardGrid';

interface Document {
    id: string;
    name: string;
    type: string;
    typeArabic: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    expiryDate: string;
    status: 'Expires' | 'Expired';
    icon?: string;
}

interface DocumentsGridSectionProps {
    documents: Document[];
    searchQuery: string;
    onUploadClick?: () => void;
}

const DocumentsGridSection: React.FC<DocumentsGridSectionProps> = ({
    documents,
    searchQuery,
    onUploadClick,
}) => {
    // Lazy import empty state component
    const DocumentEmptyState = React.lazy(() => import('./DocumentEmptyState'));

    if (documents.length === 0) {
        return (
            <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
                <DocumentEmptyState searchQuery={searchQuery} onUploadClick={onUploadClick} />
            </React.Suspense>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
                <DocumentCardGrid key={doc.id} {...doc} />
            ))}
        </div>
    );
};

export default React.memo(DocumentsGridSection);
