import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { TrashedFilter } from '@/features/departments/components/DepartmentFilterBar'
import type { TypeFilters, TypeSort } from '../types/type.types'
import { TYPES_PER_PAGE } from '../utils/typePayload'

const DEFAULT_SORT: TypeSort = '-created_at'

/** Owns list filters. Any change resets to page 1; search is debounced. */
export function useTypeFilterState() {
    const [search, setSearchRaw] = useState('')
    const [trashed, setTrashedRaw] = useState<TrashedFilter>('active')
    const [sort, setSortRaw] = useState<TypeSort>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setTrashed = useCallback((v: TrashedFilter) => { setTrashedRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: TypeSort) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setTrashedRaw('active')
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<TypeFilters>(
        () => ({
            search: debouncedSearch || undefined,
            sort,
            trashed: trashed === 'active' ? undefined : trashed,
            page,
            perPage: TYPES_PER_PAGE,
        }),
        [debouncedSearch, sort, trashed, page],
    )

    const hasActiveFilters = !!search || trashed !== 'active' || sort !== DEFAULT_SORT

    return { filters, page, setPage, search, setSearch, trashed, setTrashed, sort, setSort, hasActiveFilters, clear }
}
