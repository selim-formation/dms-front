import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type {
    DocumentCategory,
    Importance,
    ManagementFilters,
    ManagementSort,
    ManagementTab,
} from '../types/management.types'
import { DOCUMENTS_PER_PAGE, tabFilters } from '../utils/managementPayload'

const DEFAULT_SORT: ManagementSort = '-created_at'

/** Owns tab + list filters. Any change resets to page 1; search is debounced. */
export function useManagementFilterState() {
    const [tab, setTabRaw] = useState<ManagementTab>('all')
    const [search, setSearchRaw] = useState('')
    const [importance, setImportanceRaw] = useState<Importance | ''>('')
    const [category, setCategoryRaw] = useState<DocumentCategory | ''>('')
    const [sort, setSortRaw] = useState<ManagementSort>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setTab = useCallback((v: ManagementTab) => { setTabRaw(v); setPage(1) }, [])
    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setImportance = useCallback((v: Importance | '') => { setImportanceRaw(v); setPage(1) }, [])
    const setCategory = useCallback((v: DocumentCategory | '') => { setCategoryRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: ManagementSort) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setImportanceRaw('')
        setCategoryRaw('')
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<ManagementFilters>(
        () => ({
            ...tabFilters(tab),
            search: debouncedSearch || undefined,
            importance: importance || undefined,
            category: category || undefined,
            sort,
            page,
            perPage: DOCUMENTS_PER_PAGE,
        }),
        [tab, debouncedSearch, importance, category, sort, page],
    )

    const hasActiveFilters = !!search || !!importance || !!category || sort !== DEFAULT_SORT

    return {
        filters, tab, setTab, page, setPage, search, setSearch, importance, setImportance,
        category, setCategory, sort, setSort, hasActiveFilters, clear,
    }
}
