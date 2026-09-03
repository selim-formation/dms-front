import React from 'react';
import { useTranslation } from 'react-i18next';
import DocumentFilterSidebar, { type Filters, type FilterOption } from './DocumentFilterSidebar';

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    onClearFilters: () => void;
    typeOptions: FilterOption[];
    departmentOptions: FilterOption[];
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    onClearFilters,
    typeOptions,
    departmentOptions,
}) => {
    const { t } = useTranslation(['documents', 'common']);
    if (!isOpen) return null;

    return (
        <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
        >
            <div
                className="absolute end-0 top-0 bottom-0 w-80 max-w-full bg-card shadow-lg overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{t('common:actions.filters')}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-accent rounded-lg transition-colors text-muted-foreground font-bold"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4">
                    <DocumentFilterSidebar
                        filters={filters}
                        onFiltersChange={onFiltersChange}
                        onClearFilters={onClearFilters}
                        typeOptions={typeOptions}
                        departmentOptions={departmentOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(MobileFilterDrawer);
