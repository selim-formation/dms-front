import React from 'react';
import DocumentFilterSidebar from './DocumentFilterSidebar';

interface Filters {
    types: string[];
    departments: string[];
    entities: string[];
    renewals: string[];
    importances: string[];
}

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onFiltersChange: (filters: Filters) => void;
    onClearFilters: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
    isOpen,
    onClose,
    onFiltersChange,
    onClearFilters,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
        >
            <div
                className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-lg overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 font-bold"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4">
                    <DocumentFilterSidebar
                        onFiltersChange={onFiltersChange}
                        onClearFilters={onClearFilters}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(MobileFilterDrawer);
