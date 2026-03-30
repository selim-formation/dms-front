/**
 * useTaskPagination Hook
 * 
 * Custom React hook for managing pagination state and navigation.
 * Handles page tracking, per-page settings, and boundary validation.
 * 
 * Feature: 001-task-search
 * Date: 15 March 2026
 */

import { useState, useCallback } from 'react';

/**
 * Pagination state interface
 */
export interface PaginationState {
  /** Current page number (1-indexed) */
  page: number;

  /** Results per page (default: 15) */
  perPage: number;

  /** Total number of results */
  total: number;

  /** Last page number */
  lastPage: number;
}

interface UseTaskPaginationOptions {
  /** Initial page number (default: 1) */
  initialPage?: number;

  /** Initial results per page (default: 15) */
  initialPerPage?: number;

  /** Total number of results */
  total?: number;

  /** Last page number */
  lastPage?: number;
}

/**
 * Hook for managing task pagination state
 * 
 * Provides methods for:
 * - Navigation (next, previous, go to page)
 * - Per-page control (change results per page)
 * - Boundary validation (prevents invalid page numbers)
 * - State queries (isFirstPage, isLastPage, canGoPrevious, etc.)
 * 
 * @param options - Pagination configuration
 * @returns Object with pagination state and navigation methods
 * 
 * @example
 * const { 
 *   pagination,
 *   goToPage,
 *   nextPage,
 *   previousPage,
 *   setPerPage,
 *   isFirstPage,
 *   isLastPage
 * } = useTaskPagination({
 *   initialPage: 1,
 *   initialPerPage: 15,
 *   total: 100,
 *   lastPage: 7
 * });
 * 
 * console.log(pagination.page); // 1
 * 
 * // Navigate to next page
 * nextPage();
 * 
 * // Change items per page
 * setPerPage(25);
 * 
 * // Navigate to specific page
 * goToPage(3);
 */
export function useTaskPagination(options: UseTaskPaginationOptions = {}) {
  const {
    initialPage = 1,
    initialPerPage = 15,
    total = 0,
    lastPage = 1,
  } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    perPage: initialPerPage,
    total,
    lastPage,
  });

  /**
   * Go to specific page number
   * Validates page boundary before updating
   */
  const goToPage = useCallback((pageNumber: number) => {
    const validPage = Math.max(1, Math.min(pageNumber, pagination.lastPage || 1));
    setPagination(prev => ({
      ...prev,
      page: validPage,
    }));
  }, [pagination.lastPage]);

  /**
   * Navigate to previous page
   * No-op if already on first page
   */
  const previousPage = useCallback(() => {
    goToPage(pagination.page - 1);
  }, [pagination.page, goToPage]);

  /**
   * Navigate to next page
   * No-op if already on last page
   */
  const nextPage = useCallback(() => {
    goToPage(pagination.page + 1);
  }, [pagination.page, goToPage]);

  /**
   * Navigate to first page
   */
  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  /**
   * Navigate to last page
   */
  const goToLastPage = useCallback(() => {
    goToPage(pagination.lastPage);
  }, [pagination.lastPage, goToPage]);

  /**
   * Update per-page setting and reset to first page
   * Spec FR-031: When pagination changes, reset to page 1
   */
  const setPerPage = useCallback((perPage: number) => {
    // Validate perPage is between 1-100 per spec
    const validPerPage = Math.max(1, Math.min(100, perPage));
    setPagination(prev => ({
      ...prev,
      perPage: validPerPage,
      page: 1, // Reset to first page when per-page changes
    }));
  }, []);

  /**
   * Update pagination metadata (total, lastPage)
   * Usually called when API response returns new metadata
   */
  const updateMetadata = useCallback((total: number, lastPage: number) => {
    setPagination(prev => {
      // If current page is beyond new lastPage, go to lastPage
      const newPage = Math.min(prev.page, lastPage);
      return {
        ...prev,
        total,
        lastPage,
        page: newPage,
      };
    });
  }, []);

  /**
   * Reset pagination to initial state
   */
  const reset = useCallback(() => {
    setPagination({
      page: initialPage,
      perPage: initialPerPage,
      total: 0,
      lastPage: 1,
    });
  }, [initialPage, initialPerPage]);

  /**
   * Check if currently on first page
   */
  const isFirstPage = pagination.page === 1;

  /**
   * Check if currently on last page
   */
  const isLastPage = pagination.page >= pagination.lastPage;

  /**
   * Check if can navigate to previous page
   */
  const canGoPrevious = pagination.page > 1;

  /**
   * Check if can navigate to next page
   */
  const canGoNext = pagination.page < pagination.lastPage;

  /**
   * Calculate first result index on current page (1-indexed)
   */
  const fromIndex = (pagination.page - 1) * pagination.perPage + 1;

  /**
   * Calculate last result index on current page (1-indexed)
   */
  const toIndex = Math.min(pagination.page * pagination.perPage, pagination.total);

  /**
   * Get human-readable pagination summary
   * @returns String like "Results 1-15 of 100"
   */
  const getPageSummary = (): string => {
    if (pagination.total === 0) {
      return 'No results';
    }
    return `Results ${fromIndex}-${toIndex} of ${pagination.total}`;
  };

  return {
    // State
    pagination,

    // Navigation methods
    goToPage,
    previousPage,
    nextPage,
    goToFirstPage,
    goToLastPage,
    setPerPage,
    updateMetadata,
    reset,

    // Query methods
    isFirstPage,
    isLastPage,
    canGoPrevious,
    canGoNext,
    fromIndex,
    toIndex,
    getPageSummary,
  };
}
