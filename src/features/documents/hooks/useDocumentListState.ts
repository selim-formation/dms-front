/**
 * useDocumentListState - State Management Hook
 * Centralizes all page-level state in a single hook
 */

import { useState, useCallback } from 'react';
import type { FilterCriteria } from '../services/documentFilter.service';

export const INITIAL_FILTERS: FilterCriteria = {
    types: [],
    departments: [],
    entities: [],
    renewals: [],
    importances: [],
};

export type ViewMode = 'all' | 'byType' | 'byDepartment';

export function useDocumentListState() {
    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypeTab, setSelectedTypeTab] = useState<string>('');
    const [selectedDeptTab, setSelectedDeptTab] = useState<string>('');
    const [selectedFilters, setSelectedFilters] = useState<FilterCriteria>(INITIAL_FILTERS);
    const [showFilters, setShowFilters] = useState(true);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleFilterToggle = useCallback(() => {
        setShowFilters((prev) => !prev);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSelectedFilters(INITIAL_FILTERS);
    }, []);

    const handleFiltersChange = useCallback((filters: FilterCriteria) => {
        setSelectedFilters(filters);
    }, []);

    return {
        viewMode,
        searchQuery,
        selectedTypeTab,
        selectedDeptTab,
        selectedFilters,
        showFilters,
        setViewMode,
        setSearchQuery,
        setSelectedTypeTab,
        setSelectedDeptTab,
        setSelectedFilters,
        setShowFilters,
        handleSearchChange,
        handleFilterToggle,
        handleClearFilters,
        handleFiltersChange,
    };
}
