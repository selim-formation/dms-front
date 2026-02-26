import React from 'react';
import DocumentFilterSidebar from './DocumentFilterSidebar';

interface Filters {
    types: string[];
    departments: string[];
    entities: string[];
    renewals: string[];
    importances: string[];
}

interface DocumentFiltersPanelProps {
    onFiltersChange: (filters: Filters) => void;
    onClearFilters: () => void;
    isVisible: boolean;
}

const DocumentFiltersPanel: React.FC<DocumentFiltersPanelProps> = ({
    onFiltersChange,
    onClearFilters,
    isVisible,
}) => {
    if (!isVisible) return null;

    return (
        <div className="hidden lg:block">
            <DocumentFilterSidebar
                onFiltersChange={onFiltersChange}
                onClearFilters={onClearFilters}
            />
        </div>
    );
};

export default React.memo(DocumentFiltersPanel);
