import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';

interface DocumentSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onFilterToggle: () => void;
}

const DocumentSearchBar: React.FC<DocumentSearchBarProps> = ({
    searchQuery,
    onSearchChange,
    onFilterToggle,
}) => {
    const { t } = useTranslation(['documents', 'common']);
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onSearchChange(e.target.value);
        },
        [onSearchChange]
    );

    return (
        <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder={t('documentSearchBar.searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="w-full h-12 ps-12 pe-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
                />
            </div>
            <button
                onClick={onFilterToggle}
                className="flex items-center gap-2 px-4 rounded-xl bg-card border border-border hover:bg-accent transition-colors font-medium text-sm text-muted-foreground"
            >
                <Filter size={20} />
                <span className="hidden sm:inline whitespace-nowrap">{t('common:actions.filters')}</span>
            </button>
        </div>
    );
};

export default React.memo(DocumentSearchBar);
