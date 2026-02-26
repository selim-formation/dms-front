import React from 'react';
import { Plus } from 'lucide-react';

interface DocumentListHeaderProps {
    onUploadClick?: () => void;
}

const DocumentListHeader: React.FC<DocumentListHeaderProps> = ({ onUploadClick }) => {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-500 text-sm mt-2">Browse and manage your business documents</p>
            </div>
            {/* <button
                onClick={onUploadClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold"
            >
                <Plus size={18} />
                Upload
            </button> */}
        </div>
    );
};

export default React.memo(DocumentListHeader);
