import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/shared/components/layout/Navbar";
import DocumentListHeader from "@/features/documents/components/DocumentListHeader";
import DocumentSearchBar from "@/features/documents/components/DocumentSearchBar";
import DocumentViewModeTabs from "@/features/documents/components/DocumentViewModeTabs";
import DocumentListTypesTabs from "@/features/documents/components/DocumentListTypesTabs";
import DocumentResultsSummary from "@/features/documents/components/DocumentResultsSummary";
import DocumentsGridSection from "@/features/documents/components/DocumentsGridSection";
import DocumentFiltersPanel from "@/features/documents/components/DocumentFiltersPanel";
import MobileFilterDrawer from "@/features/documents/components/MobileFilterDrawer";
import PaginationControl from "@/shared/components/ui/PaginationControl";
import { useDocumentsList } from "../hooks/useDocumentsList";
import { useDocumentsByTypes } from "../hooks/useDocumentsByTypes";
import { useDocumentsByDepartments } from "../hooks/useDocumentsByDepartments";
import { useDocumentsCategorized } from "../hooks/useDocumentsCategorized";
import { useDocumentSearch } from "../hooks/useDocumentSearch";
import {
  translateTypeGroupName,
  translateDepartmentName,
} from "../utils/documentLabelDictionary";
import type { Filters } from "../components/DocumentFilterSidebar";
import type { ApiDocument, CategorizedFilters } from "../types/api.types";

const EMPTY_FILTERS: Filters = {
  types: [],
  departments: [],
  entities: [],
  renewals: [],
  importances: [],
};

type ViewMode = "all" | "byType" | "byDepartment";

/** Client-side refinement layered on top of the /categorized (server-filtered
 * by department/category/has_expire_date) response — type and importance
 * have no server param there, and search text combines with filters by
 * narrowing the already-fetched set rather than a second network round-trip. */
function refineDocuments(
  docs: ApiDocument[],
  filters: Filters,
  searchQuery: string,
): ApiDocument[] {
  let result = docs;
  if (filters.types.length > 0) {
    result = result.filter((doc) =>
      doc.types.some((type) => filters.types.includes(type.title)),
    );
  }
  if (filters.importances.length > 0) {
    result = result.filter((doc) =>
      filters.importances.includes(doc.importance.toLowerCase()),
    );
  }
  const query = searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter((doc) => doc.title.toLowerCase().includes(query));
  }
  return result;
}

export default function DocumentListPage(): React.ReactElement {
  const { t, i18n } = useTranslation(["documents", "common"]);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>("");
  const [selectedDeptTab, setSelectedDeptTab] = useState<string>("");
  // Single shared source of truth for the Advanced Filters sidebar — the
  // desktop panel and mobile drawer both render DocumentFilterSidebar as a
  // controlled component off this state, so a selection made in one stays
  // in sync with (and survives closing/reopening) the other.
  const [selectedFilters, setSelectedFilters] =
    useState<Filters>(EMPTY_FILTERS);
  // Drives the desktop sidebar panel (visible by default there). The
  // mobile drawer below tracks its own state — reusing this one for both
  // meant the drawer's full-screen backdrop mounted open on every page
  // load under the `lg` breakpoint, silently eating the first click
  // anywhere on the page (it just closed the invisible-looking backdrop).
  const [showFilters, setShowFilters] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const hasActiveFilters = useMemo(
    () => Object.values(selectedFilters).some((values) => values.length > 0),
    [selectedFilters],
  );

  // Free-text search hits the real /documents/search endpoint (debounced
  // internally). It's suppressed while a sidebar filter is active — that
  // combination is served by /categorized instead (see categorizedFilters
  // below), refined client-side by the typed title.
  const search = useDocumentSearch({
    title: hasActiveFilters ? "" : searchQuery,
  });

  // entities/renewals/departments are single-value on the backend (category /
  // has_expire_date / department) — the sidebar enforces one selection per
  // section, so [0] is always the whole selection, never a truncation.
  const categorizedFilters = useMemo<CategorizedFilters>(
    () => ({
      category: selectedFilters.entities[0],
      department: selectedFilters.departments[0],
      has_expire_date:
        selectedFilters.renewals[0] === "renewable"
          ? "true"
          : selectedFilters.renewals[0] === "one-time"
            ? "false"
            : undefined,
    }),
    [
      selectedFilters.entities,
      selectedFilters.departments,
      selectedFilters.renewals,
    ],
  );

  const categorized = useDocumentsCategorized(categorizedFilters, {
    enabled: hasActiveFilters,
  });

  const allDocs = useDocumentsList(page, {
    enabled: viewMode === "all" && !search.isActive && !hasActiveFilters,
  });
  // Also back the filter sidebar's type/department option lists, so they're
  // fetched regardless of which tab is showing.
  const byTypes = useDocumentsByTypes();
  const byDepartments = useDocumentsByDepartments();

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
        label: translateTypeGroupName(group.type, i18n.language),
        count: group.one_time.length + group.renewal.length,
      })),
    [byTypes.groups, i18n.language],
  );

  const deptTabsWithCounts = useMemo(
    () =>
      byDepartments.groups.map((group) => ({
        id: group.department,
        label: translateDepartmentName(group.department, i18n.language),
        count: group.one_time.length + group.renewal.length,
      })),
    [byDepartments.groups, i18n.language],
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
  // (filters override search, search overrides tab, then All/Types/Departments)
  // should render.
  const {
    documents,
    isLoading,
    isError,
  }: {
    documents: ApiDocument[];
    isLoading: boolean;
    isError: boolean;
  } = useMemo(() => {
    if (hasActiveFilters) {
      const flat = categorized.groups.flatMap((group) => group.documents);
      return {
        documents: refineDocuments(flat, selectedFilters, searchQuery),
        isLoading: categorized.isLoading,
        isError: categorized.isError,
      };
    }
    if (search.isActive) {
      return {
        documents: search.documents,
        isLoading: search.isLoading,
        isError: search.isError,
      };
    }
    if (viewMode === "byType") {
      const group = selectedTypeGroup;
      return {
        documents: group ? [...group.one_time, ...group.renewal] : [],
        isLoading: byTypes.isLoading,
        isError: byTypes.isError,
      };
    }
    if (viewMode === "byDepartment") {
      const group = selectedDeptGroup;
      return {
        documents: group ? [...group.one_time, ...group.renewal] : [],
        isLoading: byDepartments.isLoading,
        isError: byDepartments.isError,
      };
    }
    return {
      documents: allDocs.documents,
      isLoading: allDocs.isLoading,
      isError: allDocs.isError,
    };
  }, [
    hasActiveFilters,
    categorized.groups,
    categorized.isLoading,
    categorized.isError,
    selectedFilters,
    searchQuery,
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
    // One button, two targets: only one of these is ever visible at a
    // given viewport width (desktop panel is `hidden lg:block`, mobile
    // drawer is `lg:hidden`), so toggling both is harmless.
    setShowFilters((prev) => !prev);
    setIsMobileFilterOpen((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedFilters(EMPTY_FILTERS);
  }, []);

  const pageTitle = useMemo(() => {
    if (hasActiveFilters) return t("documentListPage.filteredResultsTitle");
    if (search.isActive) return t("documentListPage.searchResultsTitle");
    if (viewMode === "byType") {
      return selectedTypeTab
        ? translateTypeGroupName(selectedTypeTab, i18n.language)
        : t("common:nav.documents");
    }
    if (viewMode === "byDepartment") {
      return selectedDeptTab
        ? translateDepartmentName(selectedDeptTab, i18n.language)
        : t("common:nav.documents");
    }
    return t("documentListPage.allDocumentsTitle");
  }, [
    hasActiveFilters,
    search.isActive,
    viewMode,
    selectedTypeTab,
    selectedDeptTab,
    t,
    i18n.language,
  ]);

  console.log(selectedTypeTab, "sadasd");

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

        <DocumentViewModeTabs
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {!search.isActive && !hasActiveFilters && (
              <>
                <DocumentListTypesTabs
                  tabs={typeTabsWithCounts}
                  activeTab={selectedTypeTab}
                  onTabChange={setSelectedTypeTab}
                  isVisible={viewMode === "byType"}
                  label={t("documentListPage.documentTypesLabel")}
                />
                <DocumentListTypesTabs
                  tabs={deptTabsWithCounts}
                  activeTab={selectedDeptTab}
                  onTabChange={setSelectedDeptTab}
                  isVisible={viewMode === "byDepartment"}
                  label={t("documentListPage.departmentsLabel")}
                />
              </>
            )}

            <DocumentResultsSummary
              title={pageTitle}
              count={documents.length}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl border border-border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-12 text-center">
                <p className="text-destructive font-semibold">
                  {t("documentListPage.errorLoadingDocuments")}
                </p>
              </div>
            ) : (
              <DocumentsGridSection
                documents={documents}
                searchQuery={searchQuery}
              />
            )}

            {viewMode === "all" &&
              !search.isActive &&
              !hasActiveFilters &&
              allDocs.meta && (
                <PaginationControl
                  currentPage={allDocs.meta.current_page}
                  lastPage={allDocs.meta.last_page}
                  onPageChange={setPage}
                  disabled={allDocs.isFetching}
                  label={t("documentListPage.pageOf", {
                    current: allDocs.meta.current_page,
                    last: allDocs.meta.last_page,
                  })}
                />
              )}
          </div>

          <DocumentFiltersPanel
            filters={selectedFilters}
            onFiltersChange={setSelectedFilters}
            onClearFilters={handleClearFilters}
            isVisible={showFilters}
            typeOptions={typeTabsWithCounts}
            departmentOptions={deptTabsWithCounts}
          />

          <MobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            filters={selectedFilters}
            onFiltersChange={setSelectedFilters}
            onClearFilters={handleClearFilters}
            typeOptions={typeTabsWithCounts}
            departmentOptions={deptTabsWithCounts}
          />
        </div>
      </main>
    </div>
  );
}
