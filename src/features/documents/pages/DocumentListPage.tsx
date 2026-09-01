import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/shared/components/layout/Navbar';
import DocumentListHeader from '@/features/documents/components/DocumentListHeader';
import DocumentSearchBar from '@/features/documents/components/DocumentSearchBar';
import DocumentViewModeTabs from '@/features/documents/components/DocumentViewModeTabs';
import DocumentListTypesTabs from '@/features/documents/components/DocumentListTypesTabs';
import DocumentResultsSummary from '@/features/documents/components/DocumentResultsSummary';
import DocumentsGridSection from '@/features/documents/components/DocumentsGridSection';
import DocumentFiltersPanel from '@/features/documents/components/DocumentFiltersPanel';
import MobileFilterDrawer from '@/features/documents/components/MobileFilterDrawer';
import PaginationControl from '@/shared/components/ui/PaginationControl';
import { useDocumentsList } from '../hooks/useDocumentsList';
import { useDocumentsByTypes } from '../hooks/useDocumentsByTypes';
import { useDocumentsByDepartments } from '../hooks/useDocumentsByDepartments';
import { useDocumentSearch } from '../hooks/useDocumentSearch';
import type { ApiDocument } from '../types/api.types';

interface Filters {
  types: string[];
  departments: string[];
  entities: string[];
  renewals: string[];
  importances: string[];
}

type ViewMode = 'all' | 'byType' | 'byDepartment';

export default function DocumentListPage(): React.ReactElement {
  const { t } = useTranslation(['documents', 'common']);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>('');
  const [selectedDeptTab, setSelectedDeptTab] = useState<string>('');
  // Sidebar filter selections stay client-side/cosmetic for now — the
  // real /search endpoint only accepts single-value type/entity/department
  // filters, not the multi-select set this UI currently offers.
  const [, setSelectedFilters] = useState<Filters>({
    types: [],
    departments: [],
    entities: [],
    renewals: [],
    importances: [],
  });
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);

  // Free-text search hits the real /documents/search endpoint (debounced
  // internally) and, once active, replaces whatever tab is showing —
  // the backend only supports single-value type/entity/department
  // filters, so the sidebar's multi-select checkboxes stay client-side
  // for now rather than being force-fit onto it.
  const search = useDocumentSearch({ title: searchQuery });

  const allDocs = useDocumentsList(page, { enabled: viewMode === 'all' && !search.isActive });
  const byTypes = useDocumentsByTypes({ enabled: viewMode === 'byType' && !search.isActive });
  const byDepartments = useDocumentsByDepartments({
    enabled: viewMode === 'byDepartment' && !search.isActive,
  });

  // Default the type/department chip selection to the first group once loaded.
  useEffect(() => {
    if (!selectedTypeTab && byTypes.groups.length > 0) {
      setSelectedTypeTab(byTypes.groups[0].type);
    }
  }, [byTypes.groups, selectedTypeTab]);

  useEffect(() => {
    if (!selectedDeptTab && byDepartments.groups.length > 0) {
      setSelectedDeptTab(byDepartments.groups[0].department);
    }
  }, [byDepartments.groups, selectedDeptTab]);

  const typeTabsWithCounts = useMemo(
    () =>
      byTypes.groups.map((group) => ({
        id: group.type,
        label: group.type,
        count: group.one_time.length + group.renewal.length,
      })),
    [byTypes.groups],
  );

  const deptTabsWithCounts = useMemo(
    () =>
      byDepartments.groups.map((group) => ({
        id: group.department,
        label: group.department,
        count: group.one_time.length + group.renewal.length,
      })),
    [byDepartments.groups],
  );

  const selectedTypeGroup = useMemo(
    () => byTypes.groups.find((g) => g.type === selectedTypeTab),
    [byTypes.groups, selectedTypeTab],
  );

  const selectedDeptGroup = useMemo(
    () => byDepartments.groups.find((g) => g.department === selectedDeptTab),
    [byDepartments.groups, selectedDeptTab],
  );

  // Resolve which document list + loading/error state the active view
  // (search overrides tab, then All/Types/Departments) should render.
  const { documents, isLoading, isError }: {
    documents: ApiDocument[];
    isLoading: boolean;
    isError: boolean;
  } = useMemo(() => {
    if (search.isActive) {
      return { documents: search.documents, isLoading: search.isLoading, isError: search.isError };
    }
    if (viewMode === 'byType') {
      const group = selectedTypeGroup;
      return {
        documents: group ? [...group.one_time, ...group.renewal] : [],
        isLoading: byTypes.isLoading,
        isError: byTypes.isError,
      };
    }
    if (viewMode === 'byDepartment') {
      const group = selectedDeptGroup;
      return {
        documents: group ? [...group.one_time, ...group.renewal] : [],
        isLoading: byDepartments.isLoading,
        isError: byDepartments.isError,
      };
    }
    return { documents: allDocs.documents, isLoading: allDocs.isLoading, isError: allDocs.isError };
  }, [
    search.isActive,
    search.documents,
    search.isLoading,
    search.isError,
    viewMode,
    selectedTypeGroup,
    selectedDeptGroup,
    byTypes.isLoading,
    byTypes.isError,
    byDepartments.isLoading,
    byDepartments.isError,
    allDocs.documents,
    allDocs.isLoading,
    allDocs.isError,
  ]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedFilters({ types: [], departments: [], entities: [], renewals: [], importances: [] });
  }, []);

  const pageTitle = useMemo(() => {
    if (search.isActive) return t('documentListPage.searchResultsTitle');
    if (viewMode === 'byType') return selectedTypeTab || t('common:nav.documents');
    if (viewMode === 'byDepartment') return selectedDeptTab || t('common:nav.documents');
    return t('documentListPage.allDocumentsTitle');
  }, [search.isActive, viewMode, selectedTypeTab, selectedDeptTab, t]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <DocumentListHeader />
          <DocumentSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterToggle={handleFilterToggle}
          />
        </div>

        <DocumentViewModeTabs viewMode={viewMode} onViewModeChange={handleViewModeChange} />

        <div className="flex gap-8">
          <div className="flex-1">
            {!search.isActive && (
              <>
                <DocumentListTypesTabs
                  tabs={typeTabsWithCounts}
                  activeTab={selectedTypeTab}
                  onTabChange={setSelectedTypeTab}
                  isVisible={viewMode === 'byType'}
                  label={t('documentListPage.documentTypesLabel')}
                />
                <DocumentListTypesTabs
                  tabs={deptTabsWithCounts}
                  activeTab={selectedDeptTab}
                  onTabChange={setSelectedDeptTab}
                  isVisible={viewMode === 'byDepartment'}
                  label={t('documentListPage.departmentsLabel')}
                />
              </>
            )}

            <DocumentResultsSummary title={pageTitle} count={documents.length} />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-12 text-center">
                <p className="text-destructive font-semibold">{t('documentListPage.errorLoadingDocuments')}</p>
              </div>
            ) : (
              <DocumentsGridSection documents={documents} searchQuery={searchQuery} />
            )}

            {viewMode === 'all' && !search.isActive && allDocs.meta && (
              <PaginationControl
                currentPage={allDocs.meta.current_page}
                lastPage={allDocs.meta.last_page}
                onPageChange={setPage}
                disabled={allDocs.isFetching}
                label={t('documentListPage.pageOf', {
                  current: allDocs.meta.current_page,
                  last: allDocs.meta.last_page,
                })}
              />
            )}
          </div>

          <DocumentFiltersPanel
            onFiltersChange={setSelectedFilters}
            onClearFilters={handleClearFilters}
            isVisible={showFilters}
          />

          <MobileFilterDrawer
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onFiltersChange={setSelectedFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
    </div>
  );
}
