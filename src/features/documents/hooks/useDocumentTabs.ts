/**
 * useDocumentTabs - Tab Management Hook
 * Reusable tab logic for both Type and Department views
 */

import { useMemo, useEffect } from 'react';

export interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface UseDocumentTabsParams {
    groups: Array<{ name?: string; department?: string; allDocuments?: any[] }> | undefined;
    selectedTab: string;
    onTabSelect: (tabId: string) => void;
    keyField: 'name' | 'department';
}

export function useDocumentTabs({
    groups,
    selectedTab,
    onTabSelect,
    keyField,
}: UseDocumentTabsParams) {
    const tabs = useMemo(() => {

        console.log('Calculating tabs with groups:', groups, keyField);
        if (!groups || groups.length === 0) return [];
        return groups.map((group) => ({
            id: group[keyField] || '',
            label: group[keyField] || '',
            count: group.allDocuments?.length || 0,
        }));
    }, [groups, keyField]);

    useEffect(() => {
        if (tabs.length > 0 && !selectedTab) {
            onTabSelect(tabs[0].id);
        }
    }, [tabs, selectedTab, onTabSelect]);

    const selectedGroup = useMemo(() => {
        if (!groups || selectedTab === '') return undefined;
        return groups.find((g) => g[keyField] === selectedTab);
    }, [groups, selectedTab, keyField]);

    return {
        tabs,
        selectedGroup,
        hasData: tabs.length > 0,
    };
}
