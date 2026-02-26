import React, { useCallback } from 'react';
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
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onSearchChange(e.target.value);
        },
        [onSearchChange]
    );

    return (
        <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                />
            </div>
            <button
                onClick={onFilterToggle}
                className="flex items-center gap-2 px-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700"
            >
                <Filter size={20} />
                <span className="hidden sm:inline whitespace-nowrap">Filters</span>
            </button>
        </div>
    );
};

export default React.memo(DocumentSearchBar);
