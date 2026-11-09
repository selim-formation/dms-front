import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { CompanyFilters, CompanySort, CompanyTab } from '../types/company.types'
import { COMPANIES_PER_PAGE, tabFilters } from '../utils/companyPayload'

const DEFAULT_SORT: CompanySort = '-created_at'

/** Owns tab + list filters. Any change resets to page 1; search is debounced. */
export function useCompanyFilterState() {
    const [tab, setTabRaw] = useState<CompanyTab>('all')
    const [search, setSearchRaw] = useState('')
    const [hasLogo, setHasLogoRaw] = useState(false)
    const [createdThisMonth, setCreatedThisMonthRaw] = useState(false)
    const [permissionId, setPermissionIdRaw] = useState<number | null>(null)
    const [sort, setSortRaw] = useState<CompanySort>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setTab = useCallback((v: CompanyTab) => { setTabRaw(v); setPage(1) }, [])
    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const toggleHasLogo = useCallback(() => { setHasLogoRaw((v) => !v); setPage(1) }, [])
    const toggleCreatedThisMonth = useCallback(() => { setCreatedThisMonthRaw((v) => !v); setPage(1) }, [])
    const setPermissionId = useCallback((v: number | null) => { setPermissionIdRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: CompanySort) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setHasLogoRaw(false)
        setCreatedThisMonthRaw(false)
        setPermissionIdRaw(null)
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<CompanyFilters>(
        () => ({
            ...tabFilters(tab),
            search: debouncedSearch || undefined,
            hasLogo: hasLogo || undefined,
            createdThisMonth: createdThisMonth || undefined,
            permissionId: permissionId ?? undefined,
            sort,
            page,
            perPage: COMPANIES_PER_PAGE,
        }),
        [tab, debouncedSearch, hasLogo, createdThisMonth, permissionId, sort, page],
    )

    const hasActiveFilters = !!search || hasLogo || createdThisMonth || permissionId !== null || sort !== DEFAULT_SORT

    return {
        filters, tab, setTab, page, setPage, search, setSearch, hasLogo, toggleHasLogo,
        createdThisMonth, toggleCreatedThisMonth, permissionId, setPermissionId,
        sort, setSort, hasActiveFilters, clear,
    }
}
