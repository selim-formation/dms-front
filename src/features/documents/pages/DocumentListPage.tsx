import { useState, useMemo, useCallback } from 'react';
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

// Fixed set of document type / department ids used by the mock data below.
// Display labels are resolved through i18n inside the component.
const documentTypeIds = [
  'licenses',
  'permits',
  'authorizations',
  'cards',
  'approvals',
  'equipment',
] as const;

const departmentIds = ['hr', 'legal', 'engineering', 'finance', 'operations'] as const;

export default function DocumentListPage(): React.ReactElement {
  const { t } = useTranslation(['documents', 'common']);
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

  const typeLabel = useCallback(
    (id: string) => t(`documentFilterSidebar.types.${id}` as const),
    [t],
  );
  const departmentLabel = useCallback(
    (id: string) => t(`documentListPage.departments.${id}` as const),
    [t],
  );

  // Get type tabs with document counts
  const typeTabsWithCounts = useMemo(() => {
    return documentTypeIds.map((id) => ({
      id,
      label: typeLabel(id),
      count: allDocuments.filter((doc) => doc.type === id).length,
    }));
  }, [typeLabel]);

  // Get department tabs with document counts
  const deptTabsWithCounts = useMemo(() => {
    return departmentIds.map((id) => ({
      id,
      label: departmentLabel(id),
      count: allDocuments.filter((doc) => doc.department.toLowerCase() === id)
        .length,
    }));
  }, [departmentLabel]);

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
    }
  }, []);

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
      return documentTypeIds.includes(selectedTypeTab as (typeof documentTypeIds)[number])
        ? typeLabel(selectedTypeTab)
        : t('common:nav.documents');
    } else if (viewMode === 'byDepartment') {
      return departmentIds.includes(selectedDeptTab as (typeof departmentIds)[number])
        ? departmentLabel(selectedDeptTab)
        : t('common:nav.documents');
    }
    return t('documentListPage.allDocumentsTitle');
  }, [viewMode, selectedTypeTab, selectedDeptTab, typeLabel, departmentLabel, t]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

        {/* View Mode Tabs */}
        <DocumentViewModeTabs
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* Content Area with Sidebar */}
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Dynamic Slider Tabs */}
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

            {/* Results Summary */}
            <DocumentResultsSummary
              title={getPageTitle()}
              count={filteredDocuments.length}
            />

            {/* Documents Grid */}
            <DocumentsGridSection
              documents={filteredDocuments}
              searchQuery={searchQuery}
              onUploadClick={() => { }}
            />
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
