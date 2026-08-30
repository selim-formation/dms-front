/**
 * TaskSearchPage Component
 * 
 * Main page component for task search and filtering.
 * Orchestrates search, filters, pagination, and results display.
 * Per spec: Shows all tasks on initial load (FR-021), debounced search (FR-022),
 * default sort by created_at desc (FR-023), skeleton loaders (FR-024), error handling (FR-025)
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskSearch } from '@/features/tasks/hooks/useTaskSearch';
import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';
import { useTaskPagination } from '@/features/tasks/hooks/useTaskPagination';
import type { TaskSearchParams } from '@/features/tasks/contracts';
import { TaskSearchInput } from './TaskSearchInput';
import { TaskSearchError } from './TaskSearchError';
import { TaskResultsList } from './TaskResultsList';
import { Card } from '@/shared/components/ui/card';

/**
 * Task search page component
 * 
 * Features:
 * - Initial load shows all tasks (FR-021)
 * - Debounced search input with 300ms delay (FR-022)
 * - Default sort by created_at descending (FR-023)
 * - Skeleton loading states (FR-024)
 * - Error recovery with retry button (FR-025)
 * - Pagination with per-page control
 * - Clear filters button
 * 
 * @returns JSX.Element
 * 
 * @example
 * <TaskSearchPage />
 */
export function TaskSearchPage() {
  const { t } = useTranslation(['tasks', 'common']);
  const [showError, setShowError] = useState(false);

  // Initialize filter state with defaults
  const {
    filters,
    setSearchFilter,
    resetFilters,
  } = useTaskFilters();

  // Initialize pagination state
  const {
    pagination,
    goToPage,
    updateMetadata,
  } = useTaskPagination({
    initialPage: 1,
    initialPerPage: 15,
  });

  // Build search parameters from filter state
  const searchParams: TaskSearchParams = {
    search: filters.search || undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    priority: filters.priority.length > 0 ? filters.priority : undefined,
    page: pagination.page,
    per_page: pagination.perPage,
  };

  // Fetch tasks with React Query
  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useTaskSearch(searchParams);

  // Update pagination metadata when results change
  useEffect(() => {
    if (searchResults?.meta) {
      updateMetadata(searchResults.meta.total, searchResults.meta.last_page);
    }
  }, [searchResults?.meta, updateMetadata]);

  // Handle search term change
  const handleSearchChange = (searchTerm: string) => {
    setSearchFilter(searchTerm);
    goToPage(1); // Reset to first page when search changes
    setShowError(false);
  };

  // Handle search error
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Handle retry
  const handleRetry = () => {
    setShowError(false);
    refetch();
  };

  // Handle task click - navigate to task detail (future implementation)
  const handleTaskClick = (taskId: number) => {
    // TODO: Navigate to task detail page
    console.log('Navigate to task:', taskId);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    resetFilters();
    goToPage(1);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('tasks:searchPage.title')}</h1>
          <p className="text-muted-foreground">
            {t('tasks:searchPage.subtitle')}
          </p>
        </div>

        {/* Search and Filter Card */}
        <Card className="mb-8 p-6">
          {/* Search Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              {t('tasks:searchPage.searchTasksLabel')}
            </label>
            <TaskSearchInput
              value={filters.search}
              onChange={handleSearchChange}
              onClear={() => handleSearchChange('')}
              isLoading={isLoading}
              autoFocus
              placeholder={t('tasks:searchPage.searchPlaceholder')}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t('tasks:searchPage.debounceHint')}
            </p>
          </div>

          {/* Filter Summary */}
          {(filters.search || filters.status.length > 0 || filters.priority.length > 0) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('tasks:searchPage.activeFilters')} {filters.search && '1'} {filters.status.length > 0 && t('tasks:taskFilters.status')} {filters.priority.length > 0 && t('tasks:taskFilters.priority')}
              </span>
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:text-primary/90 font-medium"
              >
                {t('tasks:searchPage.clearAll')}
              </button>
            </div>
          )}
        </Card>

        {/* Error Banner */}
        {showError && error && (
          <div className="mb-6">
            <TaskSearchError
              message={
                error instanceof Error
                  ? error.message
                  : t('tasks:searchPage.defaultErrorMessage')
              }
              onRetry={handleRetry}
              onClose={() => setShowError(false)}
              isRetrying={isLoading}
            />
          </div>
        )}

        {/* Results Card */}
        <Card className="p-6">
          <TaskResultsList
            tasks={searchResults?.data || []}
            isLoading={isLoading && !showError}
            pagination={searchResults?.meta}
            onTaskClick={handleTaskClick}
            searchTerm={filters.search}
            emptyMessage={
              filters.search || filters.status.length > 0 || filters.priority.length > 0
                ? t('tasks:searchPage.emptyWithFilters')
                : t('tasks:searchPage.emptyNoFilters')
            }
          />
        </Card>

        {/* Pagination Controls - Future implementation */}
        {searchResults?.meta && searchResults.meta.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
              className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('tasks:searchPage.previous')}
            </button>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {t('tasks:searchPage.pageOf', { current: pagination.page, last: searchResults.meta.last_page })}
            </span>
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= searchResults.meta.last_page || isLoading}
              className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('tasks:searchPage.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
