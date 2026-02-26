import React from 'react';
import DynamicSliderTabs from './DynamicSliderTabs';

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface DocumentListTypeTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    isVisible: boolean;
    label?: string;
}

const DocumentListTypesTabs: React.FC<DocumentListTypeTabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    isVisible,
    label,
}) => {
    if (!isVisible) return null;

    return (
        <DynamicSliderTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            label={label}
        />
    );
};

export default React.memo(DocumentListTypesTabs);
