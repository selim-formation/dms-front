/**
 * DocumentListPageRefactored - Clean, Thin Container
 * Main page component following Clean Architecture principles
 */

import React, { useMemo } from 'react';
import Navbar from '@/shared/components/layout/Navbar';
import type { DocumentSearchParams } from '../types/search.types';
import DocumentListHeader from '@/features/documents/components/DocumentListHeader';
import DocumentSearchBar from '@/features/documents/components/DocumentSearchBar';
import DocumentViewModeTabs from '@/features/documents/components/DocumentViewModeTabs';
import DocumentListTypesTabs from '@/features/documents/components/DocumentListTypesTabs';
import DocumentResultsSummary from '@/features/documents/components/DocumentResultsSummary';
import DocumentsGridSection from '@/features/documents/components/DocumentsGridSection';
import DocumentFiltersPanel from '@/features/documents/components/DocumentFiltersPanel';
import MobileFilterDrawer from '@/features/documents/components/MobileFilterDrawer';
import DocumentTypeView from '@/features/documents/containers/DocumentTypeView';
import DocumentDepartmentView from '@/features/documents/containers/DocumentDepartmentView';

import { useDocumentListState } from '@/features/documents/hooks/useDocumentListState';
import { useDocumentFiltering } from '@/features/documents/hooks/useDocumentFiltering';
import { useDocumentTabs } from '@/features/documents/hooks/useDocumentTabs';
import { useDocumentsByTypes, useDocumentsByDepartments } from '@/features/documents/hooks/useDocumentQueries';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { useDocumentSearch, useDocumentsList } from '../hooks';
import { DocumentAdapter } from '@/features/documents/adapters/documentAdapter';
import { DocumentTransformer } from '@/features/documents/utils/document-transformer';
import {
  getTypeViewDocuments,
  getDeptViewDocuments,
  getPageTitle,
} from '@/features/documents/utils/documentViewHelpers';
import { logger } from '@/shared/utils/logger';

const log = logger.createScoped('DocumentListPageRefactored');

export default function DocumentListPageRefactored(): React.ReactElement {
  // ==================== Data Fetching ====================
  const tenantId = useTenantId();

  const { data: allDocumentsData } = useDocumentsList({
    page: 1,
    per_page: 15,
  });

  const { data: typeData, isLoading: typeLoading, error: typeError } = useDocumentsByTypes();
  const { data: deptData, isLoading: deptLoading, error: deptError } = useDocumentsByDepartments();

  // ==================== State Management ====================
  const {
    viewMode,
    searchQuery,
    selectedTypeTab,
    selectedDeptTab,
    selectedFilters,
    showFilters,
    setViewMode,
    setSelectedTypeTab,
    setSelectedDeptTab,
    handleSearchChange,
    handleFilterToggle,
    handleClearFilters,
    handleFiltersChange,
  } = useDocumentListState();

  // ==================== Tab Management ====================
  const { tabs: typeTabs, selectedGroup: selectedTypeGroup, hasData: hasTypeData } = useDocumentTabs({
    groups: typeData?.grouped,
    selectedTab: selectedTypeTab,
    onTabSelect: setSelectedTypeTab,
    keyField: 'name',
  });

  console.log('Type Tabs:', typeData, 'Selected Type Tab:', selectedTypeTab);

  const { tabs: deptTabs, selectedGroup: selectedDeptGroup, hasData: hasDeptData } = useDocumentTabs({
    groups: deptData?.grouped,
    selectedTab: selectedDeptTab,
    onTabSelect: setSelectedDeptTab,
    keyField: 'department',
  });

  // ==================== Document Filtering ====================
  const allUIDocuments = useMemo(
    () => (allDocumentsData?.data || []).map((doc) => DocumentTransformer.toUIDocument(doc)),
    [allDocumentsData],
  );

  const { filteredDocuments: allViewFiltered } = useDocumentFiltering({
    documents: allUIDocuments,
    searchQuery,
    filters: selectedFilters,
    enabled: viewMode === 'all',
  });

  const typeViewDocs = useMemo(
    () => viewMode === 'byType' ? getTypeViewDocuments(typeData?.grouped, selectedTypeTab) : { establishment: { renewal: [], oneTime: [] }, operational: { renewal: [], oneTime: [] } },
    [viewMode, typeData?.grouped, selectedTypeTab]
  );

  const deptViewDocs = useMemo(
    () => viewMode === 'byDepartment' ? getDeptViewDocuments(deptData?.grouped, selectedDeptTab) : { renewal: [], oneTime: [] },
    [viewMode, deptData?.grouped, selectedDeptTab]
  );

  // ==================== Server-side Search ====================
  const isSearchActive = useMemo(() =>
    !!(searchQuery.trim()
      || selectedFilters.types.length
      || selectedFilters.departments.length
      || selectedFilters.entities.length
      || selectedFilters.importances.length
      || selectedFilters.renewals.length),
    [searchQuery, selectedFilters],
  );

  const searchParams = useMemo<DocumentSearchParams>(() => {
    const params: DocumentSearchParams = {};
    if (searchQuery.trim()) params.title = searchQuery.trim();
    if (selectedFilters.types.length > 0) params.type = selectedFilters.types[0];
    if (selectedFilters.departments.length > 0) params.department = selectedFilters.departments[0];
    if (selectedFilters.entities.length > 0) params.entity = selectedFilters.entities[0];
    if (selectedFilters.importances.length > 0) {
      params.importance = selectedFilters.importances[0] as 'High' | 'Medium' | 'Low';
    }
    return params;
  }, [searchQuery, selectedFilters]);

  const {
    documents: searchResultDocs,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useDocumentSearch({ params: searchParams, enabled: isSearchActive });

  const searchGridDocuments = useMemo(
    () => DocumentAdapter.fromSearchDocumentsToGrid(searchResultDocs),
    [searchResultDocs],
  );

  // ==================== Error Handling ====================
  const isInitialLoading = (typeLoading || deptLoading) && !typeData && !deptData;
  const currentError = viewMode === 'byType' ? typeError : viewMode === 'byDepartment' ? deptError : null;

  if (!tenantId) log.warn('Tenant ID not available');
  if (typeError) log.error('Type data fetch error', { error: typeError });
  if (deptError) log.error('Department data fetch error', { error: deptError });

  // ==================== View Rendering ====================
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentError) {
    let errorMessage = 'Unknown error occurred';
    let errorDetails = '';
    if (currentError instanceof Error) {
      errorMessage = currentError.message;
      if (errorMessage.includes('403')) errorDetails = 'You do not have permission to access documents in this view.';
      else if (errorMessage.includes('401')) errorDetails = 'Your session has expired. Please login again.';
      else if (errorMessage.includes('404')) errorDetails = 'The requested endpoint was not found.';
      else if (errorMessage.includes('Unauthenticated')) errorDetails = 'You are not authenticated. Please ensure you are logged in.';
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <div className="mb-6 inline-block p-6 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-700 font-semibold mb-2 text-lg">📄 Error Loading Documents</p>
                <p className="text-red-600 text-sm mb-4 font-mono overflow-anywhere">{errorMessage}</p>
                {errorDetails && <p className="text-gray-600 text-sm mb-4">{errorDetails}</p>}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors font-medium"
                >
                  Go to All View
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleViewModeChange = (mode: 'all' | 'byType' | 'byDepartment') => {
    setViewMode(mode);
    if (mode === 'byType' && typeTabs.length > 0 && !selectedTypeTab) {
      setSelectedTypeTab(typeTabs[0].id);
    } else if (mode === 'byDepartment' && deptTabs.length > 0 && !selectedDeptTab) {
      setSelectedDeptTab(deptTabs[0].id);
    }
  };

  const pageTitle = getPageTitle(viewMode, selectedTypeTab, selectedDeptTab);
  const typeViewCount =
    typeViewDocs.establishment.renewal.length +
    typeViewDocs.establishment.oneTime.length +
    typeViewDocs.operational.renewal.length +
    typeViewDocs.operational.oneTime.length;
  const deptViewCount = deptViewDocs.renewal.length + deptViewDocs.oneTime.length;
  const resultCount = isSearchActive
    ? searchGridDocuments.length
    : viewMode === 'byType'
      ? typeViewCount
      : viewMode === 'byDepartment'
        ? deptViewCount
        : allViewFiltered.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <DocumentListHeader onUploadClick={() => { }} />
          <DocumentSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterToggle={handleFilterToggle}
          />
        </div>

        <DocumentViewModeTabs viewMode={viewMode} onViewModeChange={handleViewModeChange} />

        <div className="flex gap-8">
          <div className="flex-1">
            {viewMode === 'byType' && hasTypeData && (
              <DocumentListTypesTabs
                tabs={typeTabs}
                activeTab={selectedTypeTab}
                onTabChange={setSelectedTypeTab}
                isVisible={true}
                label="Entity Types"
              />
            )}

            {viewMode === 'byDepartment' && hasDeptData && (
              <DocumentListTypesTabs
                tabs={deptTabs}
                activeTab={selectedDeptTab}
                onTabChange={setSelectedDeptTab}
                isVisible={true}
                label="Departments"
              />
            )}

            <DocumentResultsSummary title={pageTitle} count={resultCount} />

            {isSearchActive ? (
              searchLoading || searchFetching ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3" />
                    <p className="text-sm text-gray-500">Searching...</p>
                  </div>
                </div>
              ) : (
                <DocumentsGridSection
                  documents={searchGridDocuments}
                  searchQuery={searchQuery}
                  onUploadClick={() => { }}
                />
              )
            ) : viewMode === 'byType' && selectedTypeGroup ? (
              <DocumentTypeView
                establishment={typeViewDocs.establishment}
                operational={typeViewDocs.operational}
                searchQuery={searchQuery}
                onUploadClick={() => { }}
              />
            ) : viewMode === 'byDepartment' && selectedDeptGroup ? (
              <DocumentDepartmentView
                renewal={deptViewDocs.renewal}
                oneTime={deptViewDocs.oneTime}
                searchQuery={searchQuery}
                onUploadClick={() => { }}
              />
            ) : (
              <DocumentsGridSection
                documents={allViewFiltered}
                searchQuery={searchQuery}
                onUploadClick={() => { }}
              />
            )}
          </div>

          <DocumentFiltersPanel
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            isVisible={showFilters}
          />

          <MobileFilterDrawer
            isOpen={showFilters}
            onClose={handleFilterToggle}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
    </div>
  );
}
