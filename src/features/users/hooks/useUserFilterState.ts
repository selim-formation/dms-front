import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { UserFilters, UserSort, UserTab } from '../types/user.types'
import { USERS_PER_PAGE, tabFilters } from '../utils/userPayload'

const DEFAULT_SORT: UserSort = '-created_at'

/** Owns tab + list filters. Any change resets to page 1; search is debounced. */
export function useUserFilterState() {
    const [tab, setTabRaw] = useState<UserTab>('all')
    const [search, setSearchRaw] = useState('')
    const [roleId, setRoleIdRaw] = useState<number | null>(null)
    const [departmentId, setDepartmentIdRaw] = useState<number | null>(null)
    const [sort, setSortRaw] = useState<UserSort>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setTab = useCallback((v: UserTab) => { setTabRaw(v); setPage(1) }, [])
    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setRoleId = useCallback((v: number | null) => { setRoleIdRaw(v); setPage(1) }, [])
    const setDepartmentId = useCallback((v: number | null) => { setDepartmentIdRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: UserSort) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setRoleIdRaw(null)
        setDepartmentIdRaw(null)
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<UserFilters>(
        () => ({
            ...tabFilters(tab),
            search: debouncedSearch || undefined,
            roleId: roleId ?? undefined,
            departmentId: departmentId ?? undefined,
            sort,
            page,
            perPage: USERS_PER_PAGE,
        }),
        [tab, debouncedSearch, roleId, departmentId, sort, page],
    )

    const hasActiveFilters = !!search || roleId !== null || departmentId !== null || sort !== DEFAULT_SORT

    return {
        filters, tab, setTab, page, setPage, search, setSearch, roleId, setRoleId,
        departmentId, setDepartmentId, sort, setSort, hasActiveFilters, clear,
    }
}
