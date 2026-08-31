import { Search, Filter, Calendar, FileType, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DocumentsFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  type: string;
  dateRange: string;
  status: string;
}

export default function DocumentsFilter({ onSearch, onFilterChange }: DocumentsFilterProps) {
  const { t } = useTranslation(['documents', 'common']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    dateRange: 'all',
    status: 'all',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder={t('documentsFilter.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full ps-10 pe-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${showAdvanced
            ? 'bg-primary/10 text-primary border border-primary/30'
            : 'bg-muted text-muted-foreground hover:bg-accent border border-border'
            }`}
        >
          <Filter size={18} />
          <span className="hidden sm:inline">{t('common:actions.filters')}</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          {/* Document Type */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {t('documentsFilter.documentType')}
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors appearance-none bg-card cursor-pointer"
            >
              <option value="all">{t('documentsFilter.allTypes')}</option>
              <option value="pdf">{t('documentsFilter.pdf')}</option>
              <option value="doc">{t('common:nav.documents')}</option>
              <option value="sheet">{t('documentsFilter.spreadsheets')}</option>
              <option value="presentation">{t('documentsFilter.presentations')}</option>
              <option value="image">{t('documentsFilter.images')}</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {t('documentsFilter.dateRange')}
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors appearance-none bg-card cursor-pointer"
            >
              <option value="all">{t('documentsFilter.allTime')}</option>
              <option value="today">{t('documentsFilter.today')}</option>
              <option value="week">{t('documentsFilter.thisWeek')}</option>
              <option value="month">{t('documentsFilter.thisMonth')}</option>
              <option value="quarter">{t('documentsFilter.thisQuarter')}</option>
              <option value="year">{t('documentsFilter.thisYear')}</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {t('documentsFilter.status')}
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors appearance-none bg-card cursor-pointer"
            >
              <option value="all">{t('documentsFilter.allStatuses')}</option>
              <option value="active">{t('common:status.active')}</option>
              <option value="review">{t('documentsFilter.underReview')}</option>
              <option value="draft">{t('common:status.draft')}</option>
              <option value="archived">{t('common:status.archived')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Tags */}
      {(filters.type !== 'all' || filters.dateRange !== 'all' || filters.status !== 'all') && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-chart-1/10 text-chart-1 rounded-full text-xs font-medium">
              {t('documentsFilter.typePrefix')} {filters.type}
              <button
                onClick={() => handleFilterChange('type', 'all')}
                className="hover:text-chart-1 transition-colors"
              >
                ✕
              </button>
            </span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-chart-2/10 text-chart-2 rounded-full text-xs font-medium">
              {t('documentsFilter.datePrefix')} {filters.dateRange}
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="hover:text-chart-2 transition-colors"
              >
                ✕
              </button>
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs font-medium">
              {t('documentsFilter.statusPrefix')} {filters.status}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="hover:text-chart-3 transition-colors"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
