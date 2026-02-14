/**
 * Pagination types and utilities
 */

/**
 * Pagination state
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Pagination params for API requests
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

/**
 * Sort state
 */
export interface SortState {
  field: string;
  order: "asc" | "desc";
}

/**
 * Sort params for API requests
 */
export interface SortParams {
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/**
 * Filter state
 */
export interface FilterState {
  [key: string]: unknown;
}

/**
 * Table state (combines pagination, sorting, filtering)
 */
export interface TableState {
  pagination: PaginationState;
  sorting: SortState | null;
  filters: FilterState;
  search: string;
}

/**
 * Create initial pagination state
 */
export function createPaginationState(
  page = 1,
  pageSize = 20,
  total = 0,
): PaginationState {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Calculate pagination range
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  delta = 2,
): number[] {
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];

  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  let l: number | undefined;
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots.filter((v) => typeof v === "number") as number[];
}
