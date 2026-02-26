import React from 'react';
import { Plus } from 'lucide-react';

interface DocumentEmptyStateProps {
    searchQuery: string;
    onUploadClick?: () => void;
}

const DocumentEmptyState: React.FC<DocumentEmptyStateProps> = ({ searchQuery, onUploadClick }) => {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-6">
                {searchQuery ? 'Try adjusting your search or filters' : 'No documents in this category'}
            </p>
            <button
                onClick={onUploadClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold"
            >
                <Plus size={18} />
                Upload Document
            </button>
        </div>
    );
};

export default React.memo(DocumentEmptyState);
