import React, { useCallback } from 'react';

interface DocumentViewModeTabsProps {
    viewMode: 'all' | 'byType' | 'byDepartment';
    onViewModeChange: (mode: 'all' | 'byType' | 'byDepartment') => void;
    onModeTransition?: (mode: string) => void;
}

const DocumentViewModeTabs: React.FC<DocumentViewModeTabsProps> = ({
    viewMode,
    onViewModeChange,
    onModeTransition,
}) => {
    const handleViewChange = useCallback(
        (mode: 'all' | 'byType' | 'byDepartment') => {
            onViewModeChange(mode);
            onModeTransition?.(mode);
        },
        [onViewModeChange, onModeTransition]
    );

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'byType', label: 'Types' },
        { id: 'byDepartment', label: 'Departments' },
    ] as const;

    return (
        <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleViewChange(tab.id)}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${viewMode === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default React.memo(DocumentViewModeTabs);
