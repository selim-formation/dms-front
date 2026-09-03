import React from 'react';
import DocumentFilterSidebar, { type Filters, type FilterOption } from './DocumentFilterSidebar';

interface DocumentFiltersPanelProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    onClearFilters: () => void;
    isVisible: boolean;
    typeOptions: FilterOption[];
    departmentOptions: FilterOption[];
}

const DocumentFiltersPanel: React.FC<DocumentFiltersPanelProps> = ({
    filters,
    onFiltersChange,
    onClearFilters,
    isVisible,
    typeOptions,
    departmentOptions,
}) => {
    if (!isVisible) return null;

    return (
        <div className="hidden lg:block">
            <DocumentFilterSidebar
                filters={filters}
                onFiltersChange={onFiltersChange}
                onClearFilters={onClearFilters}
                typeOptions={typeOptions}
                departmentOptions={departmentOptions}
            />
        </div>
    );
};

export default React.memo(DocumentFiltersPanel);
