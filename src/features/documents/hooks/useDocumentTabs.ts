/**
 * useDocumentTabs - Tab Management Hook
 * Reusable tab logic for both Type and Department views
 */

import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateDocumentTypeName, translateDepartmentName } from '../utils/documentLabelDictionary';

export interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface UseDocumentTabsParams {
    groups: Array<{ name?: string; department?: string; allDocuments?: unknown[] }> | undefined;
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
    const { i18n } = useTranslation();

    const tabs = useMemo(() => {
        if (!groups || groups.length === 0) return [];
        const translateName = keyField === 'department' ? translateDepartmentName : translateDocumentTypeName;
        return groups.map((group) => {
            const rawName = group[keyField] || '';
            return {
                id: rawName,
                label: translateName(rawName, i18n.language),
                count: group.allDocuments?.length || 0,
            };
        });
    }, [groups, keyField, i18n.language]);

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
