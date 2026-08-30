import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation(['documents', 'common']);
    const handleViewChange = useCallback(
        (mode: 'all' | 'byType' | 'byDepartment') => {
            onViewModeChange(mode);
            onModeTransition?.(mode);
        },
        [onViewModeChange, onModeTransition]
    );

    const tabs = [
        { id: 'all', label: t('common:common.all') },
        { id: 'byType', label: t('documentViewModeTabs.types') },
        { id: 'byDepartment', label: t('common:common.departments') },
    ] as const;

    return (
        <div className="flex items-center gap-2 mb-8 border-b border-border pb-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleViewChange(tab.id)}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${viewMode === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default React.memo(DocumentViewModeTabs);
