<<<<<<< Updated upstream
import { useState, useMemo, useCallback } from 'react';
import Navbar from '@/shared/components/layout/Navbar';
import DocumentListHeader from '@/features/documents/components/DocumentListHeader';
import DocumentSearchBar from '@/features/documents/components/DocumentSearchBar';
import DocumentViewModeTabs from '@/features/documents/components/DocumentViewModeTabs';
import DocumentListTypesTabs from '@/features/documents/components/DocumentListTypesTabs';
import DocumentResultsSummary from '@/features/documents/components/DocumentResultsSummary';
import DocumentsGridSection from '@/features/documents/components/DocumentsGridSection';
import DocumentFiltersPanel from '@/features/documents/components/DocumentFiltersPanel';
import MobileFilterDrawer from '@/features/documents/components/MobileFilterDrawer';

interface Document {
  id: string;
  name: string;
  type: string;
  typeArabic: string;
  department: string;
  entity: string;
  renewal: 'Renewable' | 'One-Time';
  importance: 'Critical' | 'High' | 'Medium';
  expiryDate: string;
  status: 'Expires' | 'Expired';
  icon?: string;
}

interface Filters {
  types: string[];
  departments: string[];
  entities: string[];
  renewals: string[];
  importances: string[];
}

// Sample data: Flat document list
const allDocuments: Document[] = [
  {
    id: '1',
    name: 'Business Operating License',
    type: 'licenses',
    typeArabic: 'تراخيص',
    department: 'HR',
    entity: 'Operational',
    renewal: 'Renewable',
    importance: 'Critical',
    expiryDate: 'Mar 15, 2026',
    status: 'Expires',
    icon: '📋',
  },
  {
    id: '2',
    name: 'Commercial License',
    type: 'licenses',
    typeArabic: 'تراخيص',
    department: 'Legal',
    entity: 'Establishment',
    renewal: 'Renewable',
    importance: 'Critical',
    expiryDate: 'Jun 20, 2026',
    status: 'Expires',
    icon: '📋',
  },
  {
    id: '3',
    name: 'Import-Export License',
    type: 'licenses',
    typeArabic: 'تراخيص',
    department: 'Operations',
    entity: 'Operational',
    renewal: 'Renewable',
    importance: 'High',
    expiryDate: 'May 10, 2026',
    status: 'Expires',
    icon: '📋',
  },
  {
    id: '4',
    name: 'Construction Permit',
    type: 'permits',
    typeArabic: 'تصاريح',
    department: 'Engineering',
    entity: 'Establishment',
    renewal: 'One-Time',
    importance: 'High',
    expiryDate: 'Dec 31, 2026',
    status: 'Expires',
    icon: '🏗️',
  },
  {
    id: '5',
    name: 'Environmental Permit',
    type: 'permits',
    typeArabic: 'تصاريح',
    department: 'Operations',
    entity: 'Operational',
    renewal: 'Renewable',
    importance: 'High',
    expiryDate: 'Apr 30, 2026',
    status: 'Expires',
    icon: '🏗️',
  },
  {
    id: '6',
    name: 'Bank Authorization Form',
    type: 'authorizations',
    typeArabic: 'تفويضات',
    department: 'Finance',
    entity: 'Operational',
    renewal: 'One-Time',
    importance: 'Medium',
    expiryDate: 'Feb 28, 2026',
    status: 'Expired',
    icon: '✍️',
  },
  {
    id: '7',
    name: 'Government Authorization',
    type: 'authorizations',
    typeArabic: 'تفويضات',
    department: 'Legal',
    entity: 'Establishment',
    renewal: 'Renewable',
    importance: 'Critical',
    expiryDate: 'Mar 1, 2026',
    status: 'Expires',
    icon: '✍️',
  },
  {
    id: '8',
    name: 'Corporate ID Card',
    type: 'cards',
    typeArabic: 'بطاقات',
    department: 'HR',
    entity: 'Operational',
    renewal: 'Renewable',
    importance: 'Medium',
    expiryDate: 'Aug 15, 2026',
    status: 'Expires',
    icon: '🎫',
  },
  {
    id: '9',
    name: 'Board Approval Minutes',
    type: 'approvals',
    typeArabic: 'اذونات',
    department: 'Legal',
    entity: 'Establishment',
    renewal: 'One-Time',
    importance: 'Medium',
    expiryDate: 'Dec 31, 2026',
    status: 'Expires',
    icon: '✅',
  },
  {
    id: '10',
    name: 'Audit Committee Approval',
    type: 'approvals',
    typeArabic: 'اذونات',
    department: 'Finance',
    entity: 'Operational',
    renewal: 'One-Time',
    importance: 'High',
    expiryDate: 'Jul 1, 2026',
    status: 'Expires',
    icon: '✅',
  },
  {
    id: '11',
    name: 'Equipment Maintenance Certificate',
    type: 'equipment',
    typeArabic: 'الات',
    department: 'Engineering',
    entity: 'Operational',
    renewal: 'Renewable',
    importance: 'High',
    expiryDate: 'Apr 15, 2026',
    status: 'Expires',
    icon: '⚙️',
  },
];
=======
/**
 * DocumentListPageRefactored - Clean, Thin Container
 * Main page component following Clean Architecture principles
 */

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/shared/components/layout/Navbar";
import type { DocumentSearchParams } from "../types/search.types";
import DocumentListHeader from "@/features/documents/components/DocumentListHeader";
import DocumentSearchBar from "@/features/documents/components/DocumentSearchBar";
import DocumentViewModeTabs from "@/features/documents/components/DocumentViewModeTabs";
import DocumentListTypesTabs from "@/features/documents/components/DocumentListTypesTabs";
import DocumentResultsSummary from "@/features/documents/components/DocumentResultsSummary";
import DocumentsGridSection from "@/features/documents/components/DocumentsGridSection";
import DocumentFiltersPanel from "@/features/documents/components/DocumentFiltersPanel";
import MobileFilterDrawer from "@/features/documents/components/MobileFilterDrawer";
import DocumentTypeView from "@/features/documents/containers/DocumentTypeView";
import DocumentDepartmentView from "@/features/documents/containers/DocumentDepartmentView";

import { useDocumentListState } from "@/features/documents/hooks/useDocumentListState";
import { useDocumentFiltering } from "@/features/documents/hooks/useDocumentFiltering";
import { useDocumentTabs } from "@/features/documents/hooks/useDocumentTabs";
import {
  useDocumentsByTypes,
  useDocumentsByDepartments,
} from "@/features/documents/hooks/useDocumentQueries";
import { useTenantId } from "@/core/tenant/hooks/useTenant";
import { useDocumentSearch, useDocumentsList } from "../hooks";
import { DocumentAdapter } from "@/features/documents/adapters/documentAdapter";
import { DocumentTransformer } from "@/features/documents/utils/document-transformer";
import {
  getTypeViewDocuments,
  getDeptViewDocuments,
  getPageTitle,
} from "@/features/documents/utils/documentViewHelpers";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("DocumentListPageRefactored");

export default function DocumentListPageRefactored(): React.ReactElement {
  const { t, i18n } = useTranslation(["documents", "common"]);
  // ==================== Data Fetching ====================
  const tenantId = useTenantId();
>>>>>>> Stashed changes

// Get unique types with Arabic labels
const documentTypes = [
  { id: 'licenses', label: 'Licenses (تراخيص)', arabic: 'تراخيص' },
  { id: 'permits', label: 'Permits (تصاريح)', arabic: 'تصاريح' },
  { id: 'authorizations', label: 'Authorizations (تفويضات)', arabic: 'تفويضات' },
  { id: 'cards', label: 'Cards (بطاقات)', arabic: 'بطاقات' },
  { id: 'approvals', label: 'Approvals (اذونات)', arabic: 'اذونات' },
  { id: 'equipment', label: 'Equipment (الات)', arabic: 'الات' },
];

const departments = [
  { id: 'hr', label: 'HR' },
  { id: 'legal', label: 'Legal' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'finance', label: 'Finance' },
  { id: 'operations', label: 'Operations' },
];

export default function DocumentListPage(): React.ReactElement {
  const [viewMode, setViewMode] = useState<'all' | 'byType' | 'byDepartment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>('licenses');
  const [selectedDeptTab, setSelectedDeptTab] = useState<string>('hr');
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    types: [],
    departments: [],
    entities: [],
    renewals: [],
    importances: [],
  });
  const [showFilters, setShowFilters] = useState(true);

<<<<<<< Updated upstream
  // Get type tabs with document counts
  const typeTabsWithCounts = useMemo(() => {
    return documentTypes.map((type) => ({
      id: type.id,
      label: type.label,
      count: allDocuments.filter((doc) => doc.type === type.id).length,
    }));
  }, []);
=======
  const {
    data: typeData,
    isLoading: typeLoading,
    error: typeError,
  } = useDocumentsByTypes();
  const {
    data: deptData,
    isLoading: deptLoading,
    error: deptError,
  } = useDocumentsByDepartments();
>>>>>>> Stashed changes

  // Get department tabs with document counts
  const deptTabsWithCounts = useMemo(() => {
    return departments.map((dept) => ({
      id: dept.id,
      label: dept.label,
      count: allDocuments.filter(
        (doc) => doc.department.toLowerCase() === dept.id
      ).length,
    }));
  }, []);

<<<<<<< Updated upstream
  // Filter documents based on view mode, search, and advanced filters
  const filteredDocuments = useMemo(() => {
    let result = allDocuments;

    // Search filter
    if (searchQuery) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // View mode filtering
    if (viewMode === 'byType') {
      result = result.filter((doc) => doc.type === selectedTypeTab);
    } else if (viewMode === 'byDepartment') {
      result = result.filter(
        (doc) => doc.department.toLowerCase() === selectedDeptTab
      );
    }

    // Advanced filters
    if (selectedFilters.types.length > 0) {
      result = result.filter((doc) => selectedFilters.types.includes(doc.type));
    }
    if (selectedFilters.departments.length > 0) {
      result = result.filter((doc) =>
        selectedFilters.departments.includes(doc.department.toLowerCase())
      );
    }
    if (selectedFilters.entities.length > 0) {
      result = result.filter((doc) =>
        selectedFilters.entities.includes(doc.entity.toLowerCase())
      );
    }
    if (selectedFilters.renewals.length > 0) {
      result = result.filter((doc) =>
        selectedFilters.renewals.includes(doc.renewal.toLowerCase().replace(/-/g, '-'))
      );
    }
    if (selectedFilters.importances.length > 0) {
      result = result.filter((doc) =>
        selectedFilters.importances.includes(doc.importance.toLowerCase())
      );
    }

    return result;
  }, [viewMode, selectedTypeTab, selectedDeptTab, searchQuery, selectedFilters]);

  // Memoized callbacks for optimization
  const handleViewModeChange = useCallback((mode: 'all' | 'byType' | 'byDepartment') => {
    setViewMode(mode);
    if (mode === 'byType') {
      setSelectedTypeTab('licenses');
    } else if (mode === 'byDepartment') {
      setSelectedDeptTab('hr');
=======
  // ==================== Tab Management ====================
  const {
    tabs: typeTabs,
    selectedGroup: selectedTypeGroup,
    hasData: hasTypeData,
  } = useDocumentTabs({
    groups: typeData?.grouped,
    selectedTab: selectedTypeTab,
    onTabSelect: setSelectedTypeTab,
    keyField: "name",
  });

  console.log("Type Tabs:", typeData, "Selected Type Tab:", selectedTypeTab);

  const {
    tabs: deptTabs,
    selectedGroup: selectedDeptGroup,
    hasData: hasDeptData,
  } = useDocumentTabs({
    groups: deptData?.grouped,
    selectedTab: selectedDeptTab,
    onTabSelect: setSelectedDeptTab,
    keyField: "department",
  });

  // ==================== Document Filtering ====================
  const allUIDocuments = useMemo(
    () =>
      (allDocumentsData?.data || []).map((doc) =>
        DocumentTransformer.toUIDocument(doc),
      ),
    [allDocumentsData],
  );

  const { filteredDocuments: allViewFiltered } = useDocumentFiltering({
    documents: allUIDocuments,
    searchQuery,
    filters: selectedFilters,
    enabled: viewMode === "all",
  });

  const typeViewDocs = useMemo(
    () =>
      viewMode === "byType"
        ? getTypeViewDocuments(typeData?.grouped, selectedTypeTab)
        : {
            establishment: { renewal: [], oneTime: [] },
            operational: { renewal: [], oneTime: [] },
          },
    [viewMode, typeData?.grouped, selectedTypeTab],
  );

  const deptViewDocs = useMemo(
    () =>
      viewMode === "byDepartment"
        ? getDeptViewDocuments(deptData?.grouped, selectedDeptTab)
        : { renewal: [], oneTime: [] },
    [viewMode, deptData?.grouped, selectedDeptTab],
  );

  // ==================== Server-side Search ====================
  const isSearchActive = useMemo(
    () =>
      !!(
        searchQuery.trim() ||
        selectedFilters.types.length ||
        selectedFilters.departments.length ||
        selectedFilters.entities.length ||
        selectedFilters.importances.length ||
        selectedFilters.renewals.length
      ),
    [searchQuery, selectedFilters],
  );

  const searchParams = useMemo<DocumentSearchParams>(() => {
    const params: DocumentSearchParams = {};
    if (searchQuery.trim()) params.title = searchQuery.trim();
    if (selectedFilters.types.length > 0)
      params.type = selectedFilters.types[0];
    if (selectedFilters.departments.length > 0)
      params.department = selectedFilters.departments[0];
    if (selectedFilters.entities.length > 0)
      params.entity = selectedFilters.entities[0];
    if (selectedFilters.importances.length > 0) {
      params.importance = selectedFilters.importances[0] as
        "High" | "Medium" | "Low";
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
  const isInitialLoading =
    (typeLoading || deptLoading) && !typeData && !deptData;
  const currentError =
    viewMode === "byType"
      ? typeError
      : viewMode === "byDepartment"
        ? deptError
        : null;

  if (!tenantId) log.warn("Tenant ID not available");
  if (typeError) log.error("Type data fetch error", { error: typeError });
  if (deptError) log.error("Department data fetch error", { error: deptError });

  // ==================== View Rendering ====================
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">{t("documentListPage.loadingDocuments")}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentError) {
    let errorMessage = t("documentListPage.unknownError");
    let errorDetails = "";
    if (currentError instanceof Error) {
      errorMessage = currentError.message;
      if (errorMessage.includes("403"))
        errorDetails = t("documentListPage.error403");
      else if (errorMessage.includes("401"))
        errorDetails = t("documentListPage.error401");
      else if (errorMessage.includes("404"))
        errorDetails = t("documentListPage.error404");
      else if (errorMessage.includes("Unauthenticated"))
        errorDetails = t("documentListPage.errorUnauthenticated");
    }

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <div className="mb-6 inline-block p-6 bg-destructive/10 rounded-lg border border-destructive/30">
                <p className="text-destructive font-semibold mb-2 text-lg">
                  📄 {t("documentListPage.errorLoadingDocuments")}
                </p>
                <p className="text-destructive text-sm mb-4 font-mono overflow-anywhere">
                  {errorMessage}
                </p>
                {errorDetails && (
                  <p className="text-muted-foreground text-sm mb-4">{errorDetails}</p>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
                >
                  {t("common:common.tryAgain")}
                </button>
                <button
                  onClick={() => setViewMode("all")}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors font-medium"
                >
                  {t("documentListPage.goToAllView")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleViewModeChange = (mode: "all" | "byType" | "byDepartment") => {
    setViewMode(mode);
    if (mode === "byType" && typeTabs.length > 0 && !selectedTypeTab) {
      setSelectedTypeTab(typeTabs[0].id);
    } else if (
      mode === "byDepartment" &&
      deptTabs.length > 0 &&
      !selectedDeptTab
    ) {
      setSelectedDeptTab(deptTabs[0].id);
>>>>>>> Stashed changes
    }
  }, []);

<<<<<<< Updated upstream
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedFilters({
      types: [],
      departments: [],
      entities: [],
      renewals: [],
      importances: [],
    });
  }, []);

  // Get page title based on view mode
  const getPageTitle = useCallback(() => {
    if (viewMode === 'byType') {
      const typeInfo = documentTypes.find((t) => t.id === selectedTypeTab);
      return typeInfo ? `${typeInfo.arabic} (${typeInfo.label})` : 'Documents';
    } else if (viewMode === 'byDepartment') {
      const deptInfo = departments.find((d) => d.id === selectedDeptTab);
      return deptInfo ? deptInfo.label : 'Documents';
    }
    return 'All Documents';
  }, [viewMode, selectedTypeTab, selectedDeptTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
=======
  const pageTitle = getPageTitle(viewMode, selectedTypeTab, selectedDeptTab, i18n.language);
  const typeViewCount =
    typeViewDocs.establishment.renewal.length +
    typeViewDocs.establishment.oneTime.length +
    typeViewDocs.operational.renewal.length +
    typeViewDocs.operational.oneTime.length;
  const deptViewCount =
    deptViewDocs.renewal.length + deptViewDocs.oneTime.length;
  const resultCount = isSearchActive
    ? searchGridDocuments.length
    : viewMode === "byType"
      ? typeViewCount
      : viewMode === "byDepartment"
        ? deptViewCount
        : allViewFiltered.length;

  return (
    <div className="min-h-screen bg-background">
>>>>>>> Stashed changes
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header Section */}
        <div className="mb-8">
          <DocumentListHeader onUploadClick={() => {}} />
          <DocumentSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onFilterToggle={handleFilterToggle}
          />
        </div>

<<<<<<< Updated upstream
        {/* View Mode Tabs */}
=======
>>>>>>> Stashed changes
        <DocumentViewModeTabs
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* Content Area with Sidebar */}
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
<<<<<<< Updated upstream
            {/* Dynamic Slider Tabs */}
            <DocumentListTypesTabs
              tabs={typeTabsWithCounts}
              activeTab={selectedTypeTab}
              onTabChange={setSelectedTypeTab}
              isVisible={viewMode === 'byType'}
              label="Document Types"
            />

            <DocumentListTypesTabs
              tabs={deptTabsWithCounts}
              activeTab={selectedDeptTab}
              onTabChange={setSelectedDeptTab}
              isVisible={viewMode === 'byDepartment'}
              label="Departments"
            />
=======
            {viewMode === "byType" && hasTypeData && (
              <DocumentListTypesTabs
                tabs={typeTabs}
                activeTab={selectedTypeTab}
                onTabChange={setSelectedTypeTab}
                isVisible={true}
                label={t("documentListPage.entityTypes")}
              />
            )}

            {viewMode === "byDepartment" && hasDeptData && (
              <DocumentListTypesTabs
                tabs={deptTabs}
                activeTab={selectedDeptTab}
                onTabChange={setSelectedDeptTab}
                isVisible={true}
                label={t("common:common.departments")}
              />
            )}
>>>>>>> Stashed changes

            {/* Results Summary */}
            <DocumentResultsSummary
              title={getPageTitle()}
              count={filteredDocuments.length}
            />

<<<<<<< Updated upstream
            {/* Documents Grid */}
            <DocumentsGridSection
              documents={filteredDocuments}
              searchQuery={searchQuery}
              onUploadClick={() => { }}
            />
=======
            {isSearchActive ? (
              searchLoading || searchFetching ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                    <p className="text-sm text-muted-foreground">{t("documentListPage.searching")}</p>
                  </div>
                </div>
              ) : (
                <DocumentsGridSection
                  documents={searchGridDocuments}
                  searchQuery={searchQuery}
                  onUploadClick={() => {}}
                />
              )
            ) : viewMode === "byType" && selectedTypeGroup ? (
              <DocumentTypeView
                establishment={typeViewDocs.establishment}
                operational={typeViewDocs.operational}
                searchQuery={searchQuery}
                onUploadClick={() => {}}
              />
            ) : viewMode === "byDepartment" && selectedDeptGroup ? (
              <DocumentDepartmentView
                renewal={deptViewDocs.renewal}
                oneTime={deptViewDocs.oneTime}
                searchQuery={searchQuery}
                onUploadClick={() => {}}
              />
            ) : (
              <DocumentsGridSection
                documents={allViewFiltered}
                searchQuery={searchQuery}
                onUploadClick={() => {}}
              />
            )}
>>>>>>> Stashed changes
          </div>

          {/* Right Sidebar - Advanced Filters */}
          <DocumentFiltersPanel
            onFiltersChange={setSelectedFilters}
            onClearFilters={handleClearFilters}
            isVisible={showFilters}
          />

          {/* Mobile Filter Modal */}
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
