import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { RoleFilters, RoleSort } from '../types/role.types'
import { ROLES_PER_PAGE } from '../utils/rolePayload'

const DEFAULT_SORT: RoleSort = '-created_at'

/** Owns list filters. Any change resets to page 1; search is debounced. */
export function useRoleFilterState() {
    const [search, setSearchRaw] = useState('')
    const [sort, setSortRaw] = useState<RoleSort>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: RoleSort) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<RoleFilters>(
        () => ({
            search: debouncedSearch || undefined,
            sort,
            page,
            perPage: ROLES_PER_PAGE,
        }),
        [debouncedSearch, sort, page],
    )

    const hasActiveFilters = !!search || sort !== DEFAULT_SORT

    return { filters, page, setPage, search, setSearch, sort, setSort, hasActiveFilters, clear }
}
