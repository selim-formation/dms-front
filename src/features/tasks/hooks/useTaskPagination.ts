/**
 * useTaskPagination - Placeholder
 *
 * Not wired into the app; local page/per-page state so TaskSearchPage
 * compiles.
 */

import { useCallback, useState } from 'react';

interface UseTaskPaginationParams {
  initialPage?: number;
  initialPerPage?: number;
}

export function useTaskPagination({
  initialPage = 1,
  initialPerPage = 15,
}: UseTaskPaginationParams = {}) {
  const [page, setPage] = useState(initialPage);
  const [perPage] = useState(initialPerPage);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const goToPage = useCallback((nextPage: number) => setPage(nextPage), []);
  const updateMetadata = useCallback((newTotal: number, newLastPage: number) => {
    setTotal(newTotal);
    setLastPage(newLastPage);
  }, []);

  return {
    pagination: { page, perPage, total, lastPage },
    goToPage,
    updateMetadata,
  };
}
